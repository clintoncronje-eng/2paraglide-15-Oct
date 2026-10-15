import { FaqItem } from '../types';

export const INITIAL_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    order: 1,
    category: 'booking_escrow',
    published: true,
    question: 'How does the 2paraglide Swiss Escrow system protect my payment?',
    answer:
      'When you book a tandem flight via TWINT or credit card, 100% of your payment is held securely in 2paraglide Swiss Escrow. The certified pilot (78%–85%) and the attributing QR partner (10%) are only settled after your flight safely lands and the boarding pass is verified. If weather prevents your flight or safety margins are compromised, your escrow funds are immediately refunded to your original payment method with zero penalty.'
  },
  {
    id: 'faq-2',
    order: 2,
    category: 'weather_cancellation',
    published: true,
    question: 'What happens if the alpine weather or wind is unsuitable on my flight day?',
    answer:
      'Alpine paragliding safety is 100% weather-dependent. Your SHV/BAZL-certified tandem pilot continuously monitors alpine foehn, cloud base, and thermal wind gradients. If conditions are unsafe or hold status cannot be cleared, you have full flexibility: choose to reschedule instantly to an alternate day/time slot or claim an immediate 100% statutory escrow refund.'
  },
  {
    id: 'faq-3',
    order: 3,
    category: 'safety_pilots',
    published: true,
    question: 'What certifications and insurance do 2paraglide tandem pilots carry?',
    answer:
      'Every commercial tandem pilot on 2paraglide holds an official commercial tandem license issued by the Swiss Free Flying Association (SHV / FSVL), French FFVL/DGAC, or Austrian ÖAeC. In accordance with Swiss Federal Office of Civil Aviation (BAZL/FOCA) regulations, every flight includes mandatory third-party passenger liability coverage of at least CHF 5,000,000 (or EUR 5,000,000 in EU airspace).'
  },
  {
    id: 'faq-4',
    order: 4,
    category: 'booking_escrow',
    published: true,
    question: 'How does the digital pre-flight liability waiver work?',
    answer:
      'Swiss and European aviation statutory regulations require each passenger to sign an air carrier declaration and submit emergency contact details prior to flight. With 2paraglide, you can review and sign your digital waiver directly on your smartphone in 30 seconds before launch. Once signed, a legal manifest is automatically archived to secure Firestore storage and synced with your pilot’s flight logbook.'
  },
  {
    id: 'faq-5',
    order: 5,
    category: 'partners_operators',
    published: true,
    question: 'How does the Hospitality & Hotel QR Partner program work?',
    answer:
      'Hotels, chalets, travel agencies, and cafés display an elegant acrylic table standee with a unique QR code. When guests scan the code and book a flight, 10% of the booking value (approx. CHF 24–40 per passenger) is automatically attributed and credited to the venue’s dedicated Swiss IBAN. Partners enjoy live telemetry on scans, bookings, and automated commission payouts with zero administration.'
  },
  {
    id: 'faq-6',
    order: 6,
    category: 'equipment_passenger',
    published: true,
    question: 'Are there passenger weight restrictions or physical requirements?',
    answer:
      'Tandem flights comfortably accommodate passengers weighing between 25 kg (55 lbs) and 100 kg (220 lbs). For precise wing loading and aerodynamic safety, passenger weight is recorded during booking. No extreme athleticism is needed: passengers only need to jog 5 to 10 paces down a gentle grassy slope at takeoff.'
  },
  {
    id: 'faq-7',
    order: 7,
    category: 'equipment_passenger',
    published: true,
    question: 'Can children or seniors fly tandem?',
    answer:
      'Absolutely! We routinely fly children from age 5 (with legal parental or guardian digital consent) as well as active seniors up to 90+ years old. The pilot manages all launch, flight control, and soft landing flare maneuvers. Dual-harness airbag protection and specialized tandem reserves ensure maximum safety throughout.'
  },
  {
    id: 'faq-8',
    order: 8,
    category: 'equipment_passenger',
    published: true,
    question: 'What clothing and footwear should I wear on flight day?',
    answer:
      'Sturdy closed-toe shoes with good grip (hiking boots or athletic sneakers) are required. Because high-altitude alpine air is cooler, wear comfortable long trousers, a windbreaker or warm layer, and UV sunglasses. Certified flight helmets and windproof gloves are provided by your pilot at the launch site.'
  },
  {
    id: 'faq-9',
    order: 9,
    category: 'equipment_passenger',
    published: true,
    question: 'Can I take photos and videos during the flight?',
    answer:
      'For airspace safety, unsecured handheld smartphones or loose cameras are restricted. However, all our commercial tandem pilots are equipped with professional ultra-wide 4K action cameras on extendable selfie booms. Pilots capture spectacular in-flight photos and cinematic 4K videos, which are transferred directly to your smartphone immediately after landing.'
  },
  {
    id: 'faq-10',
    order: 10,
    category: 'booking_escrow',
    published: true,
    question: 'How far in advance should I book my tandem flight?',
    answer:
      'During the peak alpine flying seasons in Interlaken, Lauterbrunnen, and Zermatt, we recommend booking 3 to 7 days ahead to secure your preferred launch hour. However, certified pilots regularly release same-day morning and afternoon thermal slots on our real-time marketplace as mountain weather updates.'
  }
];
