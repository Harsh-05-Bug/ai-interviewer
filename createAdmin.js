const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/ai_interviewer').then(async () => {
  const combined = 'G7#kP9!vL2@xR5$w' + 'mQ4&zT8^bN1*Yp6!';
  const hashed = await bcrypt.hash(combined, 12);

  await User.findOneAndUpdate(
    { email: 'hr4778336@gmail.com' },
    {
      name: 'subway@6985', // ✅ username set
      email: 'hr4778336@gmail.com',
      password: hashed,
      isAdmin: true,
    },
    { upsert: true, new: true }
  );

  console.log('✅ Admin user updated!');
  mongoose.disconnect();
}).catch(err => {
  console.error(err);
  mongoose.disconnect();
});