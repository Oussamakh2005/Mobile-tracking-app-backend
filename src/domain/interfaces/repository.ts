interface Repository<T>{
    create(entity:T) : Promise<void>;
    find(id:number) : Promise<T|null>;
    findAll() : Promise<T[]>;
    update(id : number,entity:object) : Promise<void>;
    delete(id:number) : Promise<void>;
}
export default Repository;