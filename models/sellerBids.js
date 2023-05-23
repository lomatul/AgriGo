const mongoose = require("mongoose");

const sellerBidSchema = new mongoose.Schema(
  {
    sellerBidId: {
      type: String,
      unique: true,
      uppercase: true,
      minlength: 12,
      maxlength: 12,
      validate: {
        validator: function (value) {
          return /^[A-Z0-9]+$/.test(value);
        },
        message: "SellerBidId must consist of uppercase letters and numbers",
      },
    },
    sellerEmail: {
      type: String,
      required: [true, "Please provide a valid email"],
      unique: true,
      sparse: true,
    },
    buyerOfferId: {
      type: mongoose.Types.ObjectId,
      unique: true,
      sparse: true,
    },
    sellerBidAmount: {
      type: Number,
      validate: {
        validator: function (value) {
          return value > 0;
        },
        message: "Amount must be greater than 0",
      },
    },
    bidAccepted: {
      type: Boolean,
      default: false,
    },
    updatedBidAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

sellerBidSchema.pre("save", async function (next) {
  const generateRandomId = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";
    for (let i = 0; i < 12; i++) {
      id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
  };

  while (true) {
    const id = generateRandomId();
    const existingBid = await this.constructor.findOne({ sellerBidId: id });
    if (!existingBid) {
      this.sellerBidId = id;
      break;
    }
  }

  next();
});

const SellerBid = mongoose.model("SellerBid", sellerBidSchema);

module.exports = SellerBid;
