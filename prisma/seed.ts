import { Role, ProductStatus } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

// ---------- Helpers ----------
function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a random price between 5 and 500
function randomPrice() {
  return parseFloat((Math.random() * 495 + 5).toFixed(2));
}

// Generate a random number of images (1–3) for a product
function getImageUrls(productId: number, count: number) {
  const urls: string[] = [];
  for (let i = 0; i < count; i++) {
    // Use picsum.photos with a deterministic seed based on productId and index
    const seed = productId * 10 + i;
    urls.push(`https://picsum.photos/seed/${seed}/400/400`);
  }
  return urls;
}

// ---------- Seed data ----------
async function main() {
  console.log("🌱 Seeding database...");

  // Clean up existing data (order matters because of foreign keys)
  await prisma.image.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create 5 users
  const userNames = [
    "Alice Johnson",
    "Bob Smith",
    "Carol Whites",
    "Dave Browne",
    "Eve Davis",
  ];

  const users = [];
  for (let i = 0; i < userNames.length; i++) {
    const name = userNames[i];
    const role = i === 0 ? Role.ADMIN : Role.USER; // first user is admin
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=128`;

    const user = await prisma.user.create({
      data: { name, role, avatar },
    });
    users.push(user);
    console.log(`   Created user: ${name} (${role})`);
  }

  // 2. Create 10 products
  const productNames = [
    "Wireless Headphones",
    "Smart Watch",
    "Bluetooth Speaker",
    "Laptop Stand",
    "USB-C Hub",
    "Mechanical Keyboard",
    "Gaming Mouse",
    "4K Monitor",
    "External SSD",
    "Webcam 1080p",
  ];

  const descriptions = [
    "High-quality sound with noise cancellation.",
    "Track your fitness and notifications on the go.",
    "Portable speaker with deep bass and 20h battery.",
    'Ergonomic aluminum stand for laptops up to 16".',
    "Expand your ports with 7‑in‑1 USB‑C hub.",
    "Tactile switches with RGB backlighting.",
    "Precision sensor with adjustable DPI.",
    "Ultra‑sharp display with HDR support.",
    "Fast transfer speeds up to 1000 MB/s.",
    "Full HD video with built‑in microphone.",
  ];

  for (let i = 0; i < 10; i++) {
    const name = productNames[i % productNames.length];
    const description = descriptions[i % descriptions.length];
    const price = randomPrice();
    const stock = random(0, 100);
    const status =
      stock === 0 ? ProductStatus.OUT_OF_STOCK : ProductStatus.ACTIVE;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        status,
      },
    });

    // Add 1–3 images for this product
    const imageCount = random(1, 3);
    const imageUrls = getImageUrls(product.id, imageCount);

    for (let j = 0; j < imageUrls.length; j++) {
      const url = imageUrls[j];
      const isCover = j === 0; // first image is the cover
      await prisma.image.create({
        data: {
          url,
          isCover,
          productId: product.id,
        },
      });
    }

    console.log(
      `   Created product: ${name} ($${price}) – ${imageCount} image(s)`,
    );
  }

  console.log("✅ Seeding finished.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
