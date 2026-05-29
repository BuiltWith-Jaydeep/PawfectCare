import React from 'react';
import './TermsAndConditions.css';

const TermsAndConditions = () => {
  return (
    <div className="terms-page">
      <h1>Terms and Conditions</h1>
      <p><strong>Last Updated:</strong> October 25, 2023</p>
      <p>
        Welcome to PawfectCare! By accessing or using our website, mobile applications, or any related services (collectively, the “Platform”), you agree to be bound by these Terms and Conditions (“Terms”). These Terms are a legally binding agreement between you (“User,” “you,” or “your”) and PawfectCare, its affiliates, subsidiaries, employees, agents, and representatives (collectively, “PawfectCare,” “we,” “us,” or “our”). If you do not agree to these Terms in their entirety, you must immediately cease using the Platform. Please read these Terms carefully—they’re long for a reason, and we’ve covered everything to protect our business while providing you with the best pet care services possible.
      </p>

      {/* Section 1: General Website Terms */}
      <h2>1. General Website Terms</h2>
      <h3>1.1 Eligibility to Use the Platform</h3>
      <p>
        To use the Platform, you must be at least 18 years of age or the legal age of majority in your jurisdiction, whichever is greater. By accessing the Platform, you represent and warrant that you meet this age requirement and have the legal capacity to enter into this agreement. If you are using the Platform on behalf of an entity (e.g., a business or organization), you warrant that you are an authorized representative of that entity with the authority to bind it to these Terms. PawfectCare reserves the right to refuse access to any user at its sole discretion, with or without notice, for any reason or no reason at all, including but not limited to suspected violations of these Terms or applicable laws.
      </p>
      <h3>1.2 Account Responsibilities</h3>
      <p>
        Certain features of the Platform may require you to create an account. You are solely responsible for maintaining the confidentiality of your account credentials, including your username and password. You agree to notify us immediately at support@pawfectcare.com if you suspect any unauthorized access to or use of your account. PawfectCare shall not be liable for any losses, damages, or consequences arising from your failure to secure your account or from any unauthorized use thereof. You further agree that all actions taken under your account, whether by you or a third party, are your responsibility, and we may suspend or terminate your account at our discretion if we believe it has been compromised or misused.
      </p>
      <h3>1.3 Prohibited Activities</h3>
      <p>
        You agree not to engage in any of the following activities while using the Platform:
      </p>
      <ul>
        <li>Attempting to interfere with, disrupt, or disable any feature or functionality of the Platform, including through hacking, phishing, or the introduction of viruses, worms, or other malicious code.</li>
        <li>Using the Platform for any illegal, fraudulent, or unauthorized purpose, including but not limited to violating copyright laws, trademark laws, or privacy laws.</li>
        <li>Posting, uploading, or sharing any content that is defamatory, obscene, threatening, abusive, or otherwise objectionable as determined by PawfectCare in its sole discretion.</li>
        <li>Impersonating any person or entity or misrepresenting your affiliation with any person or entity.</li>
        <li>Scraping, crawling, or otherwise extracting data from the Platform without our express written consent.</li>
      </ul>
      <p>
        Violation of these prohibitions may result in immediate termination of your access to the Platform, and we reserve the right to pursue legal action against you to the fullest extent permitted by law. We’re serious about keeping our Platform safe and functional, so don’t test us on this.
      </p>
      <h3>1.4 Intellectual Property</h3>
      <p>
        All content on the Platform—including but not limited to text, images, logos, designs, software, and code—is the property of PawfectCare or its licensors and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works of any content without our prior written permission. Any unauthorized use of our intellectual property may result in legal action, including claims for damages and injunctive relief. We’ve worked hard to build PawfectCare, and we’ll protect it fiercely.
      </p>

      {/* Section 2: Order and Booking Terms */}
      <h2>2. Order and Booking Terms</h2>
      <h3>2.1 Order Process</h3>
      <p>
        When you place an order or book a service through the Platform, you agree to provide accurate, complete, and current information as requested during the checkout or booking process. Orders and bookings are not confirmed until you receive a confirmation email from us, which may take up to 24 hours. We reserve the right to reject any order or booking at our sole discretion, including but not limited to cases of suspected fraud, unavailability of services, or incomplete payment. Once an order or booking is confirmed, it is subject to these Terms, and you’re locked in—read on for the details.
      </p>
      <h3>2.2 Payment Terms</h3>
      <p>
        All payments must be made in full at the time of order or booking unless otherwise specified. We accept various payment methods as indicated on the Platform, including credit cards, debit cards, and digital wallets. By submitting payment, you authorize us to charge the full amount, including any applicable taxes, fees, or shipping costs, to your selected payment method. If payment fails or is declined, we may cancel your order or booking without notice. All prices are listed in INR and are subject to change without prior notice—check the Platform regularly so you’re not caught off guard.
      </p>
      <h3>2.3 Cancellation, Returns, and Refunds</h3>
      <p>
        Here’s the deal: once you book a service or order a product, you’ve got exactly 24 hours from the time of confirmation to cancel and request a refund. After that, no refunds, no returns, no exceptions—period. To cancel within that 24-hour window, email us at cancellations@pawfectcare.com with your order number and a clear request. If approved, refunds will be processed to your original payment method within 5-10 business days, though we don’t guarantee the timing because banks can be slow. After 24 hours, you’re out of luck—consider it a done deal. Oh, and if you try to return something after that, we won’t accept it, so don’t bother shipping it back.
      </p>
      <h3>2.4 Delivery and Responsibility</h3>
      <p>
        For physical products, we’ll ship to the address you provide at checkout. Delivery times are estimates only—we’re not responsible for delays caused by shipping carriers, weather, acts of God, or anything else beyond our control. Once your package is handed off to the carrier, our responsibility ends. If it’s lost, damaged, or stolen after that, take it up with the carrier—we’re out of the picture. You assume all risk once the carrier has it, so track your shipment and deal with any issues yourself. We’ve done our part by getting it out the door.
      </p>

      {/* Section 3: Service-Specific Terms */}
      <h2>3. Service-Specific Terms</h2>
      <h3>3.1 Veterinary Consultation</h3>
      <p>
        <strong>Service Description:</strong> Our Veterinary Consultation service connects you with licensed veterinarians for virtual or in-person advice about your pet’s health. This is for informational purposes only—it’s not a diagnosis, treatment plan, or substitute for emergency care. You’re responsible for following up with a local vet if needed. We don’t guarantee the accuracy or outcome of any advice given.
      </p>
      <p>
        <strong>Liability Disclaimer:</strong> PawfectCare, its veterinarians, and affiliates are not liable for any misdiagnosis, incorrect advice, or adverse outcomes from using this service. If your pet gets sick, injured, or worse after a consultation, that’s on you—we’re not responsible. Use this service at your own risk, and don’t come crying to us if things go south.
      </p>
      <h3>3.2 Grooming Services</h3>
      <p>
        <strong>Service Description:</strong> We offer professional grooming, including bathing, trimming, and nail clipping, based on availability. You must provide accurate info about your pet’s health and behavior—any undisclosed issues (e.g., aggression) may result in cancellation mid-service with no refund. We decide what’s best for your pet during the session.
      </p>
      <p>
        <strong>Liability Disclaimer:</strong> If your pet gets stressed, injured, or has an allergic reaction during grooming, we’re not liable. Our groomers do their best, but pets are unpredictable. You accept all risks, and we’re off the hook for any vet bills or damages that might come up.
      </p>
      <h3>3.3 Pet Adoption Assistance</h3>
      <p>
        <strong>Service Description:</strong> We help you find pets available for adoption through third-party shelters and partners. We’re just the middleman—final adoption decisions, fees, and paperwork are between you and the shelter. We don’t guarantee you’ll get a pet or that it’ll be a perfect match.
      </p>
      <p>
        <strong>Liability Disclaimer:</strong> If the pet you adopt has health issues, behavioral problems, or doesn’t work out, don’t blame us. We’re not responsible for the pet’s condition or your experience—we just connect you. All risks are yours, and we’re not liable for any costs or consequences.
      </p>
      <h3>3.4 Pet Boarding & Daycare</h3>
      <p>
        <strong>Service Description:</strong> We provide temporary boarding and daycare for your pet. You must provide proof of vaccinations and disclose any special needs. We reserve the right to refuse service if your pet poses a risk to others. Care is basic—don’t expect luxury unless you pay extra.
      </p>
      <p>
        <strong>Liability Disclaimer:</strong> If your pet gets sick, injured, or lost while in our care, we’re not responsible. We’ll try to keep them safe, but accidents happen. You waive any claims against us for vet bills, damages, or emotional distress—your pet, your risk.
      </p>
      <h3>3.5 Vaccination</h3>
      <p>
        <strong>Service Description:</strong> We offer vaccination services through licensed professionals. You must provide your pet’s medical history, and we’ll administer shots based on that. We don’t guarantee immunity or check your pet’s overall health—that’s your job.
      </p>
      <p>
        <strong>Liability Disclaimer:</strong> If your pet has a reaction, gets sick, or the vaccine fails, we’re not liable. Side effects happen, and we’re not covering vet costs or damages. You accept all risks, and we’re clear of any responsibility.
      </p>

      {/* Section 4: Limitation of Liability */}
      <h2>4. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, PawfectCare and its affiliates, officers, directors, employees, and agents shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform or services. This includes, but is not limited to, damages for loss of profits, goodwill, data, pet health, or other intangible losses, even if we’ve been advised of the possibility of such damages. If something goes wrong—your pet gets sick, a package doesn’t arrive, a service flops—it’s not our problem. You’re on your own, and we’re not paying a dime.
      </p>

      {/* Section 5: Governing Law */}
      <h2>5. Governing Law</h2>
      <p>
        These Terms are governed by the laws of India, without regard to its conflict of law principles. Any disputes arising from these Terms or your use of the Platform shall be resolved exclusively in the courts of India, and you consent to the jurisdiction of those courts. If you try to sue us somewhere else, good luck—we’re sticking to our turf.
      </p>

      {/* Section 6: Changes to Terms */}
      <h2>6. Changes to Terms</h2>
      <p>
        We can update these Terms anytime, for any reason, without notice. The updated version will be posted on the Platform, and your continued use after that means you accept the changes. Check back often—we’re not calling you to let you know.
      </p>

      {/* Section 7: Contact Information */}
      <h2>7. Contact Information</h2>
      <p>
        Got questions? Email us at support@pawfectcare.com or call +91 9313279435. 
      </p>
    </div>
  );
};

export default TermsAndConditions;