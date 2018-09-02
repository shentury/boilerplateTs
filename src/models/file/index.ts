import {Model} from "../../interfaces/Model/IModel";
import {model, Schema} from "mongoose";

class FileModel extends Model{

    setSchema(): FileModel {
        this.schema = new Schema({
            owner:{type:String,required:true},
            filename:{type: String,required: true},
            originalname:{type: String,required: true},
            encoding:{type: String,required: true},
            mimetype:{type: String,required: true},
            path:{type: String,required: true},
            size:{type: Number,required: true},
            requirepassword:{type: Boolean,default:true},
            password:{type: String},
        },{timestamps:true});
        return this;
    }
    constructor(){
        super('files');
    }
}

const fileModel = new FileModel();

export {fileModel};