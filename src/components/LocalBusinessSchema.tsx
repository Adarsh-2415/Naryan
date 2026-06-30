import React from "react";

export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "name": "Narayan Homoeopathic Chikitsalaya",
    "alternateName": "नारायण होम्योपैथिक चिकित्सालय",
    "description": "Narayan Homoeopathic Chikitsalaya is a leading homeopathic clinic in Roorkee, providing constitutional treatment, clinical oncology support, and pathological diagnostic services.",
    "url": "https://narayanhomeopathy.com",
    "telephone": "+91-1332 270021",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "First street, Neelam cinema crossing 32, Jamun Road, Civil Lines",
      "addressLocality": "Roorkee",
      "addressRegion": "Uttarakhand",
      "postalCode": "247667",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 29.8658178,
      "longitude": 77.8875836
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "sameAs": [
      "https://maps.google.com/?q=Narayan+Homoeopathic+Chikitsalaya+Roorkee"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
