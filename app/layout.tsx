import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const socialPreviewUrl =
  "https://terrapinmassage.com/images/terrapin-message-preview.jpg";
const socialPreviewAlt =
  "Massage session in the Terrapin Massage treatment room";

const businessStructuredData = {
  "@context": "https://schema.org",
  "@type": "MassageTherapist",
  "@id": "https://terrapinmassage.com/#business",
  name: "Terrapin Massage",
  url: "https://terrapinmassage.com/",
  image: socialPreviewUrl,
  telephone: "+18339047267",
  description:
    "Personalized massage and barefoot bodywork in Casper, Wyoming.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "300 Landmark Dr",
    addressLocality: "Casper",
    addressRegion: "WY",
    postalCode: "82609",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "City",
    name: "Casper",
  },
  hasMap: "https://maps.google.com/?q=300+Landmark+Dr,+Casper,+WY+82609",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://terrapinmassage.com"),
  title: {
    default: "Terrapin Massage",
    template: "%s | Terrapin Massage",
  },
  description:
    "Personalized massage and barefoot bodywork in Casper, Wyoming. Find your service and book a session at Terrapin Massage.",
  applicationName: "Terrapin Massage",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Terrapin Massage",
    title: "Terrapin Massage",
    description:
      "Personalized massage and barefoot bodywork in Casper, Wyoming. Find your service and book a session at Terrapin Massage.",
    locale: "en_US",
    images: [
      {
        url: socialPreviewUrl,
        secureUrl: socialPreviewUrl,
        type: "image/jpeg",
        width: 1200,
        height: 630,
        alt: socialPreviewAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terrapin Massage",
    description:
      "Personalized massage and barefoot bodywork in Casper, Wyoming. Find your service and book a session at Terrapin Massage.",
    images: [{ url: socialPreviewUrl, alt: socialPreviewAlt }],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(businessStructuredData),
          }}
        />
        {children}
      </body>
    </html>
  );
}
