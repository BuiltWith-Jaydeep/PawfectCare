const DayCare = require('../models/DayCare');

exports.createDayCare = async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      petType,
      breed,
      boardingStartDate,
      boardingEndDate,
      noAllergies,
      socialization,
      emergencyContact,
      appointmentDate,
      appointmentTime,
      estimatedPrice,
    } = req.body;

    if (
      !name || !phone || !address || !petType || !breed || !boardingStartDate ||
      !boardingEndDate || !noAllergies || !socialization || !emergencyContact ||
      !appointmentDate || !appointmentTime || !estimatedPrice
    ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newDayCare = new DayCare({
      userId: req.user.id,
      name,
      phone,
      address,
      petType,
      breed,
      boardingStartDate,
      boardingEndDate,
      noAllergies,
      socialization,
      emergencyContact,
      appointmentDate,
      appointmentTime,
      estimatedPrice,
    });

    await newDayCare.save();
    res.status(201).json({ message: 'Daycare booked successfully!', dayCare: newDayCare });
  } catch (error) {
    console.error('Error creating daycare:', error);
    res.status(500).json({ error: 'Server error while booking daycare' });
  }
};

exports.getUserDayCare = async (req, res) => {
  try {
    const { userId } = req.params;
    // Owner or admin only. Authority comes from the verified token (req.user), never the URL.
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && req.user.id !== userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const dayCareBookings = await DayCare.find({ userId: isAdmin ? userId : req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(dayCareBookings || []);
  } catch (error) {
    console.error('Error fetching daycare bookings:', error);
    res.status(500).json({ error: 'Server error while fetching daycare bookings' });
  }
};

exports.getAllDayCares = async (req, res) => {
  try {
    const dayCares = await DayCare.find().sort({ createdAt: -1 });
    res.status(200).json(dayCares || []);
  } catch (error) {
    console.error('Error fetching all daycare bookings:', error);
    res.status(500).json({ error: 'Server error while fetching daycare bookings' });
  }
};

exports.updateDayCare = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedDayCare = await DayCare.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!updatedDayCare) {
      return res.status(404).json({ error: 'Daycare booking not found' });
    }

    res.status(200).json({ message: 'Daycare booking updated successfully', dayCare: updatedDayCare });
  } catch (error) {
    console.error('Error updating daycare:', error);
    res.status(500).json({ error: 'Server error while updating daycare booking' });
  }
};

exports.deleteDayCare = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDayCare = await DayCare.findByIdAndDelete(id);

    if (!deletedDayCare) {
      return res.status(404).json({ error: 'Daycare booking not found' });
    }

    res.status(200).json({ message: 'Daycare booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting daycare:', error);
    res.status(500).json({ error: 'Server error while deleting daycare booking' });
  }
};