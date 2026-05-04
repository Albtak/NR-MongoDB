import { User } from "@/models/Users";
import dbConnect from "@/lib/mongoose";

interface UserData {
    name: string;
    email: string;
    password: string;
}


export async function createUser(userData  : UserData){
    try {

await dbConnect();
 const newUser = await User.create(userData);
 return { success: true, user: newUser.toObject() , status: 201};

    }

    catch(error){
        console.error("Error creating user:", error);
        return { success: false, error: "Failed to create user" , status: 500};
    }

} 

