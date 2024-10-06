import User from "../../domain/entities/user.js";
import { PrismaClient} from "@prisma/client";
import Repository from "../../domain/interfaces/repository.js";

class UsersRepository implements Repository<User> {
    constructor(private prisma : PrismaClient){}
    async create(entity: User): Promise<void> {
        await this.prisma.user.create({data : entity});
    }
    async find(id: number): Promise<User | null> {
        return await this.prisma.user.findUnique({where : {id}});
    }
    async findByEmail(email : string) : Promise<User | null> {
        return await this.prisma.user.findFirst({where : {email}});
    }
    async findAll(): Promise<User[]> {
        return await this.prisma.user.findMany();
    }
    async update(id: number, entity: object): Promise<void> {
        await this.prisma.user.update({where : {id}, data : entity});
    }
    async delete(id: number): Promise<void> {
        await this.prisma.user.delete({where : {id}});
    }
}

export default UsersRepository