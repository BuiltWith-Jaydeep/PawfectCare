const Grooming = require('../models/Grooming');

exports.createGrooming = async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      email,
      animalType,
      breed,
      age,
      behavioralNotes,
      coatType,
      groomingPreference,
      appointmentDate,
      appointmentTime,
      estimatedPrice,
    } = req.body;

    if (
      !name || !phone || !address || !email || !animalType || !breed || !age ||
      !behavioralNotes || !coatType || !groomingPreference || !appointmentDate || 
      !appointmentTime || !estimatedPrice
    ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newGrooming = new Grooming({
      userId: req.user.id,
      name,
      phone,
      address,
      email,
      animalType,
      breed,
      age,
      behavioralNotes,
      coatType,
      groomingPreference,
      appointmentDate,
      appointmentTime,
      estimatedPrice,
    });

    await newGrooming.save();
    res.status(201).json({ message: 'Grooming booked successfully!', grooming: newGrooming });
  } catch (error) {
    console.error('Error creating grooming:', error);
    res.status(500).json({ error: 'Server error while booking grooming' });
  }
};

exports.getUserGrooming = async (req, res) => {
  try {
    const { userId } = req.params;
    // Owner or admin only. Authority comes from the verified token (req.user), never the URL.
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && req.user.id !== userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const groomingAppointments = await Grooming.find({ userId: isAdmin ? userId : req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(groomingAppointments || []);
  } catch (error) {
    console.error('Error fetching grooming appointments:', error);
    res.status(500).json({ error: 'Server error while fetching grooming appointments' });
  }
};

exports.getAllGrooming = async (req, res) => {
  try {
    const groomingAppointments = await Grooming.find().sort({ createdAt: -1 });
    res.status(200).json(groomingAppointments || []);
  } catch (error) {
    console.error('Error fetching all grooming appointments:', error);
    res.status(500).json({ error: 'Server error while fetching grooming appointments' });
  }
};

exports.updateGrooming = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedGrooming = await Grooming.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!updatedGrooming) {
      return res.status(404).json({ error: 'Grooming appointment not found' });
    }

    res.status(200).json({ message: 'Grooming appointment updated successfully', grooming: updatedGrooming });
  } catch (error) {
    console.error('Error updating grooming:', error);
    res.status(500).json({ error: 'Server error while updating grooming appointment' });
  }
};

exports.deleteGrooming = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedGrooming = await Grooming.findByIdAndDelete(id);

    if (!deletedGrooming) {
      return res.status(404).json({ error: 'Grooming appointment not found' });
    }

    res.status(200).json({ message: 'Grooming appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting grooming:', error);
    res.status(500).json({ error: 'Server error while deleting grooming appointment' });
  }
};