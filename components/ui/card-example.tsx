import { Example } from "@/components/example";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

interface CardExampleProps {
  imageSrc: string;
  imageAlt?: string;
  cardTitle: string;
  cardDescription: string;
}

export default function CardExample({ 
  imageSrc, 
  imageAlt = "Card image", 
  cardTitle, 
  cardDescription 
}: CardExampleProps) {
  return (
    <Card className="relative w-full max-w-sm overflow-hidden pt-0">
      <div className="absolute inset-0 z-30 aspect-video opacity-50" />
      <Image
        src={imageSrc}
        alt={imageAlt}
        className="relative z-20 aspect-video w-full object-cover"
        width={768}
        height={512}
      />
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>
          {cardDescription}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
