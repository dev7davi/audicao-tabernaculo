const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const all = await prisma.candidato.findMany();
  console.log(all);
}
main();
