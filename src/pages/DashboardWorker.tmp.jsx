import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShiftContext } from '../context/ShiftContext';
import DashboardLayout from '../components/DashboardLayout';
import ShiftCard from '../components/ShiftCard';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { Home, Search, ClipboardList, Wallet, User, CheckCircle, Clock, IndianRupee, FileText, Upload } from 'lucide-react';

const WORKER_NAV_ITEMS = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'browse', icon: Search, label: 'Browse' },
  { id: 'applications', icon: ClipboardList, label: 'Applications' },
  { id: 'earnings', icon: Wallet, label: 'Earnings' },
  { id: 'profile', icon: User, label: 'Profile' },
];

// ... (Copy WorkerHome, WorkerBrowse, WorkerApplications, WorkerEarnings, WorkerProfile from previous state to avoid deleting them)
// Wait, I will use replace_file_content to just update the DashboardWorker component and imports if I can.
// Actually, it's easier to rewrite the whole file because I need to add `WORKER_NAV_ITEMS` and pass it.
// I will fetch the file, replace the required parts.
