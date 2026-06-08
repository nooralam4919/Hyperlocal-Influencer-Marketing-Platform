import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    title:{
        type: String,
        required: [true, "title is required"],
    },
    description:{
        type: String,
        required: [true, "description is required"],
    },
    videoFile:{ // videsFile comming form AWS in Link form and it is required because we need to store the link of the video file in the database
        type: String,
        required: [true, "videoFile is required"],
    },
    thumbnail:{
        type: String,
        required: [true, "thumbnail is required"],
    },
    duration:{  // also comming from AWS and it is required because we need to store the duration of the video in the database
        type: Number,
        required: [true, "duration is required"],
    },
    views:{
        type: Number,
        default: 0,
    },
    isPublished:{
        type: Boolean,
        default: false,
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },

}, {timestamps: true})


videoSchema.plugin(mongooseAggregatePaginate); // this line is used to add the pagination functionality to the videoSchema. we will use this plugin in the video controller to paginate the videos when we get all the videos from the database.

export const Video = mongoose.model("Video", videoSchema);
