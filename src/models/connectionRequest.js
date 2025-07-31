const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect`,
      },
    },
  },
  { timestamps: true }
);
//creating index for optimizaton
connectionRequestSchema.index({fromUserId:1,toUserId:1}) 
// pre model to check to and from are same
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send request to yourself!!");
  }
  next();
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
