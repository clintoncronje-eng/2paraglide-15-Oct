import React, { useState } from 'react';
import {
  BookingData,
  CountryExpansionConfig,
  FlightSlotData,
  QrCampaignData,
  WorkspaceView,
  FaqItem
} from '../types';
import { formatCurrency } from '../lib/validation';
import { Download, FileCode2, ShieldAlert, ArrowRight } from 'lucide-react';
import { OwnerFaqManager } from './OwnerFaqManager';
import { INITIAL_FAQS } from '../data/initialFaqs';

interface OwnerDashboardViewProps {
  bookings: BookingData[];
  slots: FlightSlotData[];
  qrCampaigns: QrCampaignData[];
  countries: CountryExpansionConfig[];
  onToggleCountryStatus: (
    countryCode: string,
    nextStatus: CountryExpansionConfig['status']
  ) => void;
  onUpdateBookingStatus: (
    bookingId: string,
    status: 'completed' | 'cancelled'
  ) => Promise<void>;
  onNavigate?: (view: WorkspaceView) => void;
  faqs?: FaqItem[];
  onUpdateFaqs?: (newFaqs: FaqItem[]) => void;
  onPublishFaqs?: (faqsToPublish: FaqItem[]) => Promise<void> | void;
  lastFaqPublishedAt?: string | null;
}

interface PilotVerificationEntry {
  pilotId: string;
  name: string;
  countryCode: string;
  licenseNumber: string;
  authority: string;
  insuranceCoverage: string;
  verified: boolean;
}

export const OwnerDashboardView: React.FC<OwnerDashboardViewProps> = ({
  bookings,
  qrCampaigns,
  countries,
  onToggleCountryStatus,
  onUpdateBookingStatus,
  onNavigate,
  faqs = INITIAL_FAQS,
  onUpdateFaqs = () => {},
  onPublishFaqs = () => {},
  lastFaqPublishedAt
}) => {
  const [ledgerFilter, setLedgerFilter] = useState<'ALL' | 'confirmed' | 'completed' | 'cancelled'>('ALL');
  const [pilotQueue, setPilotQueue] = useState<PilotVerificationEntry[]>([
    {
      pilotId: 'demo_pilot_wyss',
      name: 'Beat Wyss',
      countryCode: 'CH',
      licenseNumber: 'SHV-CH-44910',
      authority: 'SHV / BAZL Tandem Commercial',
      insuranceCoverage: 'AXA Winterthur CHF 5,000,000',
      verified: true
    },
    {
      pilotId: 'demo_pilot_keller',
      name: 'Marc Keller',
      countryCode: 'CH',
      licenseNumber: 'SHV-CH-38204',
      authority: 'SHV / BAZL Tandem Commercial',
      insuranceCoverage: 'Zurich Alpine CHF 5,000,000',
      verified: true
    },
    {
      pilotId: 'demo_pilot_moreau',
      name: 'Luc Moreau',
      countryCode: 'FR',
      licenseNumber: 'FFVL-FR-99214',
      authority: 'DGAC / FFVL BPJEPS Vol Libre',
      insuranceCoverage: 'MAIF Aviation EUR 5,000,000',
      verified: false
    },
    {
      pilotId: 'demo_pilot_hofer',
      name: 'Andreas Hofer',
      countryCode: 'AT',
      licenseNumber: 'OEAC-AT-77120',
      authority: 'ÖAeC Tandemschein Commercial',
      insuranceCoverage: 'Allianz Alpine EUR 5,000,000',
      verified: false
    }
  ]);

  const activeBookings = bookings.filter((b) => b.status !== 'cancelled');
  const totalGmvCents = activeBookings.reduce((sum, b) => sum + b.totalAmountCents, 0);
  const totalPlatformFeeCents = activeBookings.reduce((sum, b) => sum + b.platformFeeCents, 0);
  const totalPilotEscrowCents = activeBookings.reduce((sum, b) => sum + b.pilotPayoutCents, 0);
  const totalPartnerCommCents = activeBookings.reduce((sum, b) => sum + b.partnerCommissionCents, 0);

  const filteredBookings = bookings.filter(
    (b) => ledgerFilter === 'ALL' || b.status === ledgerFilter
  );

  const handleTogglePilotVerify = (pilotId: string) => {
    setPilotQueue((prev) =>
      prev.map((p) => (p.pilotId === pilotId ? { ...p, verified: !p.verified } : p))
    );
  };

  const handleExportCsv = () => {
    const header =
      'BookingID,Date,Time,Location,Country,Flyer,Pilot,PartnerQR,Currency,Gross,PlatformFee,PilotPayout,PartnerCommission,PaymentMethod,Status\n';
    const rows = bookings
      .map(
        (b) =>
          `${b.bookingId},${b.flightDate},${b.flightTime},"${b.locationName}",${b.countryCode},"${b.flyerName}","${b.pilotName}",${b.partnerCode},${b.currency},${(
            b.totalAmountCents / 100
          ).toFixed(2)},${(b.platformFeeCents / 100).toFixed(2)},${(
            b.pilotPayoutCents / 100
          ).toFixed(2)},${(b.partnerCommissionCents / 100).toFixed(2)},${b.paymentMethod},${b.status}`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '2paraglide-owner-escrow-ledger.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#8A8A8A]/25 pb-6">
        <div className="space-y-1">
          <div className="text-xs font-mono text-[#E62B1E]">
            DASHBOARD 01 · EXECUTIVE &amp; TREASURY CONSOLE
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-wide text-[#FFFFFF]">
            1. OWNER DASHBOARD — GLOBAL ESCROW &amp; EXPANSION
          </h1>
          <p className="text-sm text-[#8A8A8A]">
            Monitor 3-way escrow splits, approve SHV/FFVL tandem pilot licenses, and manage multi-country expansion.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {onNavigate && (
            <>
              <button
                type="button"
                onClick={() => onNavigate('script')}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-[#FFFFFF] bg-[#181818] hover:bg-[#242424] border border-[#8A8A8A]/30 hover:border-[#E62B1E] rounded-lg transition-all cursor-pointer shadow-sm group"
                title="View 00. Master Architecture Script"
              >
                <FileCode2 className="w-4 h-4 text-[#E62B1E] group-hover:scale-110 transition-transform" />
                <span>00. Master Architecture Script</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('security_audit')}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-[#FFFFFF] bg-[#181818] hover:bg-[#242424] border border-[#8A8A8A]/30 hover:border-emerald-500 rounded-lg transition-all cursor-pointer shadow-sm group"
                title="View Security & Red Team Audit"
              >
                <ShieldAlert className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Security &amp; Red Team Audit</span>
              </button>
            </>
          )}

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#FFFFFF] bg-[#E62B1E] hover:bg-[#c82317] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export Escrow Ledger CSV</span>
          </button>
        </div>
      </div>

      {/* Architecture & Security Direct Access Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={() => onNavigate && onNavigate('script')}
          className="bg-[#181818] border border-[#8A8A8A]/25 hover:border-[#E62B1E]/60 rounded-xl p-5 flex items-center justify-between gap-4 cursor-pointer transition-all hover:bg-[#1f1f1f] group shadow-sm"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#E62B1E]/15 border border-[#E62B1E]/40 flex items-center justify-center shrink-0">
              <FileCode2 className="w-5 h-5 text-[#E62B1E]" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#FFFFFF] group-hover:text-[#E62B1E] transition-colors flex items-center gap-1.5">
                <span>00. Master Architecture Script</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-[#8A8A8A] mt-0.5">
                Full technical specification, escrow split logic, data architecture, and 12-chapter blueprint.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-[#E62B1E] bg-[#E62B1E]/10 px-2.5 py-1 rounded border border-[#E62B1E]/30 shrink-0">
            SPEC →
          </span>
        </div>

        <div
          onClick={() => onNavigate && onNavigate('security_audit')}
          className="bg-[#181818] border border-[#8A8A8A]/25 hover:border-emerald-500/60 rounded-xl p-5 flex items-center justify-between gap-4 cursor-pointer transition-all hover:bg-[#1f1f1f] group shadow-sm"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#FFFFFF] group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                <span>Security &amp; Red Team Audit</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-[#8A8A8A] mt-0.5">
                Zero-trust Firestore security rules, adversarial attack simulations, and audit test results.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-500/30 shrink-0">
            AUDIT PASS →
          </span>
        </div>
      </div>

      {/* 4-Column Executive Treasury KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#181818] border border-[#8A8A8A]/25 rounded-xl p-5 space-y-1">
          <div className="text-xs text-[#8A8A8A]">Gross Booking Volume (Active GMV)</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#FFFFFF]">
            {formatCurrency(totalGmvCents, 'CHF')}
          </div>
          <div className="text-xs text-[#8A8A8A] font-mono">
            <span className="text-[#E62B1E] font-bold">{activeBookings.length}</span> Active / Completed Flights
          </div>
        </div>

        <div className="bg-[#181818] border border-[#8A8A8A]/25 rounded-xl p-5 space-y-1">
          <div className="text-xs text-[#8A8A8A]">2paraglide Net Platform Revenue</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#E62B1E]">
            {formatCurrency(totalPlatformFeeCents, 'CHF')}
          </div>
          <div className="text-xs text-[#8A8A8A]">
            12.0% on QR Partner · 15.0% on Direct
          </div>
        </div>

        <div className="bg-[#181818] border border-[#8A8A8A]/25 rounded-xl p-5 space-y-1">
          <div className="text-xs text-[#8A8A8A]">Pilot Escrow Payout Allocation</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#FFFFFF]">
            {formatCurrency(totalPilotEscrowCents, 'CHF')}
          </div>
          <div className="text-xs text-[#8A8A8A]">
            78.0%–85.0% settled via Stripe Connect IBAN
          </div>
        </div>

        <div className="bg-[#181818] border border-[#8A8A8A]/25 rounded-xl p-5 space-y-1">
          <div className="text-xs text-[#8A8A8A]">Hospitality QR Partner Commissions</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-[#E62B1E]">
            {formatCurrency(totalPartnerCommCents, 'CHF')}
          </div>
          <div className="text-xs text-[#8A8A8A]">
            10.0% across {qrCampaigns.length} Hotel &amp; Tourism QR Codes
          </div>
        </div>
      </div>

      {/* Multi-Country Rollout & Regulatory Matrix */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-[#FFFFFF]">
              European Multi-Country Expansion &amp; Regulatory Routing
            </h2>
            <p className="text-xs text-[#8A8A8A]">
              Launched in Switzerland (CHF / TWINT / SHV) with instant jurisdiction toggles for France, Austria, and Italy.
            </p>
          </div>
        </div>

        <div className="bg-[#181818] border border-[#8A8A8A]/25 rounded-xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#8A8A8A]/25 text-xs font-semibold text-[#8A8A8A] bg-[#111111]">
                <th className="py-3 px-4">Country &amp; ISO</th>
                <th className="py-3 px-4">Aviation Authority</th>
                <th className="py-3 px-4">Currency &amp; VAT</th>
                <th className="py-3 px-4">Payment Rails</th>
                <th className="py-3 px-4">Primary Alpine Hubs</th>
                <th className="py-3 px-4 text-right">Supply</th>
                <th className="py-3 px-4 text-right">Market Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8A8A8A]/20 text-xs">
              {countries.map((c) => (
                <tr key={c.countryCode} className="hover:bg-[#111111]/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#FFFFFF]">
                    {c.countryName} (<span className="text-[#E62B1E] font-mono">{c.countryCode}</span>)
                  </td>
                  <td className="py-3.5 px-4 text-[#8A8A8A]">{c.aviationAuthority}</td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-[#FFFFFF]">
                    {c.currency} · <span className="text-[#E62B1E]">{c.vatRatePercent.toFixed(1)}%</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#8A8A8A]">
                    {c.paymentMethods.join(' · ')}
                  </td>
                  <td className="py-3.5 px-4 text-[#8A8A8A]">
                    {c.primaryHubs.slice(0, 2).join(' · ')}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#FFFFFF]">
                    <span className="text-[#E62B1E]">{c.activePilotsCount}</span> Pilots / {c.activePartnersCount} Partners
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={c.status}
                      onChange={(e) =>
                        onToggleCountryStatus(
                          c.countryCode,
                          e.target.value as CountryExpansionConfig['status']
                        )
                      }
                      className="px-2.5 py-1 text-xs font-semibold border border-[#8A8A8A]/40 rounded-md bg-[#111111] text-[#FFFFFF] cursor-pointer focus:border-[#E62B1E] focus:outline-none"
                    >
                      <option value="live">LIVE IN PRODUCTION</option>
                      <option value="pilot_onboarding">PILOT ONBOARDING</option>
                      <option value="regulatory_review">REGULATORY REVIEW</option>
                      <option value="planned">PLANNED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SHV / IPPI Pilot License & Insurance Verification Queue */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#FFFFFF]">
            SHV / European Tandem Pilot License &amp; Insurance Verification Queue
          </h2>
          <p className="text-xs text-[#8A8A8A]">
            Only verified pilots with active CHF/EUR 5,000,000 commercial passenger liability cover can receive escrow payouts.
          </p>
        </div>

        <div className="bg-[#181818] border border-[#8A8A8A]/25 rounded-xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#8A8A8A]/25 text-xs font-semibold text-[#8A8A8A] bg-[#111111]">
                <th className="py-3 px-4">Pilot Name</th>
                <th className="py-3 px-4">Country</th>
                <th className="py-3 px-4">License Number</th>
                <th className="py-3 px-4">Issuing Authority</th>
                <th className="py-3 px-4">Passenger Liability Policy</th>
                <th className="py-3 px-4">Verification State</th>
                <th className="py-3 px-4 text-right">Governance Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8A8A8A]/20 text-xs">
              {pilotQueue.map((p) => (
                <tr key={p.pilotId} className="hover:bg-[#111111]/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#FFFFFF]">{p.name}</td>
                  <td className="py-3.5 px-4 font-mono text-[#E62B1E]">{p.countryCode}</td>
                  <td className="py-3.5 px-4 font-mono text-[#FFFFFF]">{p.licenseNumber}</td>
                  <td className="py-3.5 px-4 text-[#8A8A8A]">{p.authority}</td>
                  <td className="py-3.5 px-4 font-mono text-[#8A8A8A]">{p.insuranceCoverage}</td>
                  <td className="py-3.5 px-4 font-mono">
                    {p.verified ? (
                      <span className="text-[#FFFFFF] font-semibold">VERIFIED ACTIVE</span>
                    ) : (
                      <span className="text-[#E62B1E] font-semibold">PENDING AUDIT</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleTogglePilotVerify(p.pilotId)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        p.verified
                          ? 'bg-[#111111] text-[#8A8A8A] border border-[#8A8A8A]/40 hover:text-[#FFFFFF]'
                          : 'bg-[#E62B1E] text-[#FFFFFF] hover:bg-[#c82317]'
                      }`}
                    >
                      {p.verified ? 'Revoke Approval' : 'Approve SHV/IPPI License'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Master 3-Way Escrow Ledger */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#FFFFFF]">
              Master 3-Way Escrow &amp; Attribution Ledger
            </h2>
            <p className="text-xs text-[#8A8A8A]">
              Every booking shows exact integer Rappen/Cents allocation between Pilot, QR Partner, and 2paraglide.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#181818] border border-[#8A8A8A]/25 rounded-lg">
            {(['ALL', 'confirmed', 'completed', 'cancelled'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setLedgerFilter(st)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  ledgerFilter === st
                    ? 'bg-[#E62B1E] text-[#FFFFFF]'
                    : 'text-[#8A8A8A] hover:text-[#FFFFFF]'
                }`}
              >
                {st.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#181818] border border-[#8A8A8A]/25 rounded-xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#8A8A8A]/25 text-xs font-semibold text-[#8A8A8A] bg-[#111111]">
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Location &amp; Date</th>
                <th className="py-3 px-4">Flyer / Pilot</th>
                <th className="py-3 px-4">QR Partner</th>
                <th className="py-3 px-4 text-right">Gross Paid</th>
                <th className="py-3 px-4 text-right">Pilot (78–85%)</th>
                <th className="py-3 px-4 text-right">Partner (10%)</th>
                <th className="py-3 px-4 text-right">Platform (12–15%)</th>
                <th className="py-3 px-4 text-right">Status &amp; Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8A8A8A]/20 text-xs">
              {filteredBookings.map((b) => (
                <tr key={b.bookingId} className="hover:bg-[#111111]/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[#E62B1E] font-semibold">
                    #{b.bookingId}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#FFFFFF]">{b.locationName}</div>
                    <div className="font-mono text-[#8A8A8A]">
                      {b.flightDate} · {b.flightTime} · {b.paymentMethod}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#FFFFFF]">
                    <div>Flyer: {b.flyerName}</div>
                    <div className="text-[#8A8A8A]">Pilot: {b.pilotName}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#8A8A8A]">{b.partnerCode}</td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-[#FFFFFF]">
                    {formatCurrency(b.totalAmountCents, b.currency)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#8A8A8A]">
                    {formatCurrency(b.pilotPayoutCents, b.currency)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#FFFFFF]">
                    {formatCurrency(b.partnerCommissionCents, b.currency)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#E62B1E] font-semibold">
                    {formatCurrency(b.platformFeeCents, b.currency)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {b.status === 'confirmed' ? (
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onUpdateBookingStatus(b.bookingId, 'completed')}
                          className="px-2.5 py-1 text-xs font-semibold text-[#111111] bg-[#FFFFFF] hover:bg-[#e5e5e5] rounded-md whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Settle Escrow
                        </button>
                        <button
                          onClick={() => onUpdateBookingStatus(b.bookingId, 'cancelled')}
                          className="px-2.5 py-1 text-xs font-semibold text-[#FFFFFF] bg-[#E62B1E] hover:bg-[#c82317] rounded-md whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Refund
                        </button>
                      </div>
                    ) : (
                      <span className="font-mono font-semibold text-[#8A8A8A]">
                        {b.status.toUpperCase()}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
