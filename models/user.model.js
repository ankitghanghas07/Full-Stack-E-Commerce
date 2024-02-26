const bcrypt = require('bcryptjs');
const db = require('../data/database');
const { ObjectId } = require('mongodb');


class User{
    constructor(email, password, fullname, street, city, pincode){
        this.email = email,
        this.password = password,
        this.name = fullname,
        this.address = {
            street : street,
            city : city, 
            pincode : pincode
        }
    }

    static findUserById(userId){
        return db.getDb().collection('users').findOne({_id : new ObjectId(userId)}, {password : 0});
    }

    getUserWithSameEmail(){
        return db.getDb().collection('users').findOne({email : this.email});
    }

    hasCorrectPassword(hashedPassword){
        return bcrypt.compare(this.password, hashedPassword); // returns a promise.
    }

    async signup(){
        const hashedPassword = await bcrypt.hash(this.password, 12);
        await db.getDb().collection('users').insertOne({
            email : this.email,
            password : hashedPassword,
            name : this.fullname,
            address : this.address
        });
    }
};

module.exports = User;