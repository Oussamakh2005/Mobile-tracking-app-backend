class User {
    constructor(
        public email: string,
        public username: string,
        public password: string,
        public phoneId: string,
        public readonly isVerified?: boolean,
        public readonly id?: number,
    ) {}

}
export default User;