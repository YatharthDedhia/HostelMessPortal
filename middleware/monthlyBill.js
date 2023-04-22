const Account = require('../models/Account');
const User = require('../models/User');
const Meal = require('../models/Meal');
const cron = require('node-cron');
const nodeMailer = require('nodemailer')
const catchAsyncErrors = require('../middleware/catchAsyncErrors');


const sendMailUsers = async (emailObj) => {
    const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });
    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: emailObj,
        subject: "Hostel Mess Bill",
        text: "pay your bill",
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        }

        else {
            console.log("mail sent")
        }
    });
}

const sendBill = () => {
    console.log("sending bill")
    cron.schedule('*/30 * * * * *', async function () {
        const userData = await User.find({});
        if (userData.length > 0) {
            var emails = []
            userData.map((key) => {
                emails.push(key.email)
            })

            console.log(emails);
            sendMailUsers(emails);
        }
    })
}

const getUserInfo = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body
    const user = await User.findOne({ "email": email });
    if (!user)
        return next(new errorHandler(`User does not exist`, 400));

    console.log(user._id);
    var acc = await Account.findOne({ "user": user._id })
    if (!acc)
        return next(new errorHandler(`Account does not exist`, 400));

    const leaves = acc.leaves

    function processDate(date) {
        var parts = date.split("/");
        return new Date(parts[2], parts[1] - 1, parts[0]);
    }

    var meals = await Meal.find()

    await Account.findOneAndUpdate(
        { "user": user._id },
        {
            meals: []
        }
    );

    var push_bool = true;
    if (acc.leaves.length == 0) {
        console.log("length 0")
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
    res.status(201).json({ acc })
})

module.exports = {
    sendBill,
    sendMailUsers
}