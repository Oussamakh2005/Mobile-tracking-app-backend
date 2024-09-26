class UsersRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(entity) {
        await this.prisma.user.create({ data: entity });
    }
    async find(id) {
        return await this.prisma.user.findUnique({ where: { id } });
    }
    async findByEmail(email) {
        return await this.prisma.user.findFirst({ where: { email } });
    }
    async findAll() {
        return await this.prisma.user.findMany();
    }
    async update(id, entity) {
        await this.prisma.user.update({ where: { id }, data: entity });
    }
    async delete(id) {
        await this.prisma.user.delete({ where: { id } });
    }
}
export default UsersRepository;
