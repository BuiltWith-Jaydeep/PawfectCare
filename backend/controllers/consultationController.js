const Consultation = require('../models/Consultation');

exports.createConsultation = async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      email,
      animalType,
      breed,
      age,
      medicalHistory,
      reason,
      behavioralNotes,
      consent,
      appointmentDate,
      appointmentTime,
      estimatedPrice,
    } = req.body;

    if (
      !name || !phone || !address || !email || !animalType || !breed || !age ||
      !medicalHistory || !reason || !behavioralNotes || consent === undefined ||
      !appointmentDate || !appointmentTime || !estimatedPrice
    ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newConsultation = new Consultation({
      userId: req.user.id,
      name,
      phone,
      address,
      email,
      animalType,
      breed,
      age,
      medicalHistory,
      reason,
      behavioralNotes,
      consent,
      appointmentDate,
      appointmentTime,
      estimatedPrice,
    });

    await newConsultation.save();
    res.status(201).json({ message: 'Consultation booked successfully!', consultation: newConsultation });
  } catch (error) {
    console.error('Error creating consultation:', error);
    res.status(500).json({ error: 'Server error while booking consultation' });
  }
};

exports.getUserConsultations = async (req, res) => {
  try {
    const { userId } = req.params;
    // Owner or admin only. Authority comes from the verified token (req.user), never the URL.
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && req.user.id !== userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const consultations = await Consultation.find({ userId: isAdmin ? userId : req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(consultations || []);
  } catch (error) {
    console.error('Error fetching consultations:', error);
    res.status(500).json({ error: 'Server error while fetching consultations' });
  }
};

exports.getAllConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find().sort({ createdAt: -1 });
    res.status(200).json(consultations || []);
  } catch (error) {
    console.error('Error fetching all consultations:', error);
    res.status(500).json({ error: 'Server error while fetching consultations' });
  }
};

exports.updateConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedConsultation = await Consultation.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!updatedConsultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    res.status(200).json({ message: 'Consultation updated successfully', consultation: updatedConsultation });
  } catch (error) {
    console.error('Error updating consultation:', error);
    res.status(500).json({ error: 'Server error while updating consultation' });
  }
};

exports.deleteConsultation = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedConsultation = await Consultation.findByIdAndDelete(id);

    if (!deletedConsultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    res.status(200).json({ message: 'Consultation deleted successfully' });
  } catch (error) {
    console.error('Error deleting consultation:', error);
    res.status(500).json({ error: 'Server error while deleting consultation' });
  }
};