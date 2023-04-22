const Account = require('../models/Account');
const User = require('../models/User');
const Meal = require('../models/Meal');
const cron = require('node-cron');
const nodeMailer = require('nodemailer')
const catchAsyncErrors = require('../middleware/catchAsyncErrors');


const sendMailUsers = async (emailId, inp) => {
    const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    // const inp = {
    //     "_id": "6443cb4990c6e02bf25f9c2d",
    //     "user": "6443cb4990c6e02bf25f9c2b",
    //     "amount": 0,
    //     "meals": [
    //         {
    //             "date": "23/04/2023",
    //             "item": "cabbage",
    //             "price": 15,
    //             "mealType": "lunch",
    //             "_id": "64439e472aa00f2433452a62"
    //         },
    //         {
    //             "date": "23/04/2023",
    //             "item": "poha",
    //             "price": 20,
    //             "mealType": "breakfast",
    //             "_id": "64439e362aa00f2433452a5f"
    //         },
    //         {
    //             "date": "22/04/2023",
    //             "item": "chole",
    //             "price": 10,
    //             "mealType": "dinner",
    //             "_id": "64439e212aa00f2433452a5c"
    //         },
    //         {
    //             "date": "24/04/2023",
    //             "item": "upma",
    //             "price": 15,
    //             "mealType": "breakfast",
    //             "_id": "64439e822aa00f2433452a6b"
    //         },
    //         {
    //             "date": "24/04/2023",
    //             "item": "vada pav",
    //             "price": 18,
    //             "mealType": "snacks",
    //             "_id": "64439ec92aa00f2433452a71"
    //         },
    //         {
    //             "date": "24/04/2023",
    //             "item": "cauliflower",
    //             "price": 20,
    //             "mealType": "lunch",
    //             "_id": "64439e932aa00f2433452a6e"
    //         },
    //         {
    //             "date": "24/04/2023",
    //             "item": "pav bhaji",
    //             "price": 30,
    //             "mealType": "dinner",
    //             "_id": "64439ed72aa00f2433452a74"
    //         }
    //     ],
    //     "leaves": [],
    //     "deposits": [],
    //     "__v": 0
    // };

    let htmlStr = "<html><head><style>table {border-collapse: collapse; width: 100%;} th, td {text-align: left; padding: 8px; border: 1px solid black;} th {background-color: #ddd;} tr:nth-child(even) {background-color: #f2f2f2;}</style></head><body>";
    htmlStr += "<table class='my-table'>";
    htmlStr += "<thead><tr><th>Date</th><th>Item</th><th>Price</th><th>Meal Type</th></tr></thead>";
    htmlStr += "<tbody>";
    let total = 0;
    for (const meal of inp.meals) {
        htmlStr += `<tr><td>${meal.date}</td><td>${meal.item}</td><td>${meal.mealType}</td><td>${meal.price}</td></tr>`;
        total += meal.price;
    }
    htmlStr += `<tr><td style='border: 1px solid black;' colspan='2'><strong>Total:</strong></td><td style='border: 1px solid black;'></td><td style='border: 1px solid black;'><strong>${total}</strong></td></tr>`;
    htmlStr += "</tbody></table>";
    htmlStr += "</body></html>";

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: emailId,
        subject: "Hostel Mess Bill",
        text: "pay your bill",
        html: htmlStr
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        }

        else {
            console.log(`mail sent to ${emailId}`)
        }
    });
}

const sendBill = () => {
    //*/30 * * * * *
    cron.schedule('0 0 28-31 * *', async function () {
        const userData = await User.find({
            "role": { $in: ["student", "Student"] }
        });
        if (userData.length > 0) {
            userData.map(async (user) => {
                // console.log(user)
                var acc = await Account.findOne({ "user": user._id })
                if (!acc)
                    return

                const leaves = acc.leaves

                function processDate(date) {
                    var parts = date.split("/");
                    return new Date(parts[2], parts[1] - 1, parts[0]);
                }

                var meals = await Meal.find(
                    {
                        "date": {
                            "$regex": "^[0-9]{2}/" + (new Date().getMonth() + 1).toString().padStart(2, '0') + "/" + new Date().getFullYear() + "$"
                        },
                    }
                )

                await Account.findOneAndUpdate(
                    { "user": user._id },
                    {
                        meals: []
                    }
                );

                var push_bool = true;
                if (acc.leaves.length == 0) {
                    // console.log("length 0")
                    meals.forEach(async (meal) => {
                        await Account.findOneAndUpdate(
                            { "user": user._id },
                            {
                                $push: { meals: meal }
                            }
                        );
                    })
                }
                else {
                    for (var i = 0; i < meals.length; i++) {
                        push_bool = true;
                        for (var j = 0; j < leaves.length; j++) {
                            // leaves[j] for only 1 meal
                            const cond1 = (leaves[j].startDate == leaves[j].endDate && meals[i].date == leaves[j].startDate && meals[i].mealType == leaves[j].mealType)

                            // leaves[j] for a period of time
                            const cond2 = (leaves[j].startDate != leaves[j].endDate && processDate(leaves[j].startDate) <= processDate(leaves[j].endDate) && processDate(meals[i].date) >= processDate(leaves[j].startDate) && processDate(meals[i].date) <= processDate(leaves[j].endDate))

                            if (cond1 || cond2) {
                                push_bool = false
                            }
                        }
                        if (push_bool) {
                            await Account.findOneAndUpdate(
                                { "user": user._id },
                                {
                                    $push: { meals: meals[i] }
                                }
                            )
                        }
                    }
                }
                acc = await Account.findOne({ "user": user._id })
                sendMailUsers(user.email, acc);
            })
        }
    })
}

module.exports = {
    sendBill,
}