const mongoose = require("mongoose");

const BuyerOffersSchema = new mongoose.Schema(
  {
    // ...other fields
    buyerEmail: {
      type: String,
      required: [true, "Please provide a valid email"],
    },
    itemOfferId: {
      type: String,
      default: null,
    },
    itemName: {
      type: String,
      required: [true, "Please provide item name"],
    },
    itemPrice: {
      type: String,
      default: null,
      required: [true, "Please provide item price"],
    },
    itemDescription: {
      type: String,
    },
    itemCategory: {
      type: String,
      required: [true, "Choose a category!"],
    },
    isFlexibleDate: {
      type: Boolean,
      default: true,
      required: [true, "Choose if your dates are flexible!"],
    },
    flexibleDateRange: {
      flexibleDateStart: {
        type: Date,
      },
      flexibleDateEnd: {
        type: Date,
      },
    },
    itemDeadline: {
      type: Date,
    },
    isExpired: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

if (!BuyerOffersSchema.path('isExpired')) {
  BuyerOffersSchema.add({
    isExpired: {
      type: Boolean,
      default: false,
    },
  });
}

BuyerOffersSchema.pre("save", async function (next) {
  try {
      const categoryPrefix = this.itemCategory.substr(0, 2).toUpperCase();
      const emailSuffix = this.buyerEmail.split("@")[0].slice(-2).toUpperCase();
      console.log(categoryPrefix + " " + emailSuffix);
      const currentDate = new Date();
      const year = currentDate.getFullYear().toString().substr(-2);
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const day = currentDate.getDate().toString().padStart(2, "0");
      
      const offersCount = await BuyerOffers.countDocuments({
        itemCategory: this.itemCategory,
      });
      
      const sequentialNumber = (offersCount + 1).toString().padStart(5, "0");
      const itemOfferId = `${categoryPrefix}${emailSuffix}${year}${month}${day}${sequentialNumber}`;
      
      console.log(itemOfferId);
      this.itemOfferId = itemOfferId;
  } catch (error) {
    console.log(error);
  }
  next();
});

const BuyerOffers = mongoose.model("BuyerOffers", BuyerOffersSchema);
module.exports = BuyerOffers;
