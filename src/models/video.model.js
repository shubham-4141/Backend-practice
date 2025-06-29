import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const VideoSchema = new Schema(
    {
        VideoFile:{
            type:String, // cloudinary url
            required:true
        },
        thumbnall:{
            type:String, // cloudinary url
            required:true
        },
        title:{
            type:String,
            required:true
        },
        description:{
            type:String, 
            required:true
        },
        duration:{
            type:Number, 
            default:0
        },
        isPublished:{
            type:Boolean, 
            default:true
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }

    },
    {timestamps:true})

    VideoSchema.plugin(mongooseAggregatePaginate)



export const Video = mongoose.model("Video",VideoSchema)