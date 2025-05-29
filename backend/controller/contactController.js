import Contact from "../models/Contact.js";

const addQuery = async (req,res)=>{
    try{
        const { name, email, message } = req.body;
        const newQuery = new Contact({
            name: name,
            email: email,
            message: message
        });
        await newQuery.save();
        console.log('Query sent:', newQuery);
        res.status(201).json({ message: "Query sent successfully", data: newQuery });
    }
    catch(error){
        console.error('Error sending query:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export {addQuery};