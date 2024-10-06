import User from "../../domain/entities/user.js";
import UsersRepository from "../../interfaces_adapters/repositories/usersRepository.js";

class UserService {
    constructor(private userRepository : UsersRepository){}
    createUser(entity: User): Promise<void> {
        return this.userRepository.create(entity);
    }
    findUser(id: number): Promise<User |null> {
        return this.userRepository.find(id);
    }
    findByEmail(email : string) : Promise<User | null> {
        return this.userRepository.findByEmail(email);
    }
    findAllUsers(): Promise<User[]> {
        return this.userRepository.findAll();
    }
    updateUser(id : number,entity: object): Promise<void> {
        return this.userRepository.update(id,entity);
    }
    delete(id: number): Promise<void> {
        return this.userRepository.delete(id);
    }
}
export default UserService;