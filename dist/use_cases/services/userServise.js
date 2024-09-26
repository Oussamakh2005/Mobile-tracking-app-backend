class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    createUser(entity) {
        return this.userRepository.create(entity);
    }
    findUser(id) {
        return this.userRepository.find(id);
    }
    findByEmail(email) {
        return this.userRepository.findByEmail(email);
    }
    findAllUsers() {
        return this.userRepository.findAll();
    }
    updateUser(id, entity) {
        return this.userRepository.update(id, entity);
    }
    delete(id) {
        return this.userRepository.delete(id);
    }
}
export default UserService;
