/**
 * Promote (or create) the admin account.
 *
 *   npm run seed:admin
 *   npm run seed:admin -- --reset-password
 *
 * Reads SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD from backend/.env.
 *
 * Behaviour:
 *   - If a user with that email EXISTS -> set role='admin'.
 *       Password is left ALONE unless --reset-password is passed.
 *   - If it does NOT exist            -> create it with SEED_ADMIN_PASSWORD.
 *
 * Idempotent: safe to run repeatedly. Never prints the password.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const { MONGODB_URI, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, DNS_SERVERS } = process.env;
const RESET_PASSWORD = process.argv.includes('--reset-password');

function fail(msg) {
  console.error('\nERROR: ' + msg + '\n');
  process.exit(1);
}

(async () => {
  if (!MONGODB_URI) fail('MONGODB_URI is not set in backend/.env');
  if (!SEED_ADMIN_EMAIL) fail('SEED_ADMIN_EMAIL is not set in backend/.env');

  if (DNS_SERVERS) {
    require('dns').setServers(DNS_SERVERS.split(',').map((s) => s.trim()));
  }

  const email = SEED_ADMIN_EMAIL.toLowerCase().trim();

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ email });

    if (existing) {
      const changes = [];

      if (existing.role !== 'admin') {
        existing.role = 'admin';
        changes.push('promoted to admin');
      }

      if (RESET_PASSWORD) {
        if (!SEED_ADMIN_PASSWORD) {
          fail('--reset-password requires SEED_ADMIN_PASSWORD in backend/.env');
        }
        existing.password = await bcrypt.hash(SEED_ADMIN_PASSWORD, 10);
        changes.push('password reset to SEED_ADMIN_PASSWORD');
      }

      if (changes.length) {
        await existing.save({ validateModifiedOnly: true });
        console.log('\n  ' + email + ': ' + changes.join(', ') + '\n');
      } else {
        console.log('\n  Already an admin: ' + email + ' (no change)');
        console.log('  Password untouched. Add --reset-password to overwrite it.\n');
      }
    } else {
      if (!SEED_ADMIN_PASSWORD) {
        fail('No user ' + email + ' exists and SEED_ADMIN_PASSWORD is not set, so one cannot be created.');
      }
      const hashed = await bcrypt.hash(SEED_ADMIN_PASSWORD, 10);
      await User.create({
        username: 'admin',
        email,
        password: hashed,
        role: 'admin',
        phone: '0000000000',
        address: 'N/A',
        petName: 'N/A',
        petType: 'other',
        breed: 'N/A',
      });
      console.log('\n  Created admin account: ' + email);
      console.log('  Password is the SEED_ADMIN_PASSWORD from backend/.env\n');
    }

    const admins = await User.find({ role: 'admin' }).select('email');
    console.log('  Admins now (' + admins.length + '): ' + admins.map((a) => a.email).join(', ') + '\n');
  } catch (err) {
    fail(err.message);
  } finally {
    await mongoose.disconnect();
  }
})();
