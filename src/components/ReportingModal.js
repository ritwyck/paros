import React, { useState } from "react";
import { motion } from "framer-motion";

// Reporting Component
const ReportingModal = ({ isOpen, onClose, targetUser, currentUser }) => {
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportReasons = [
    "Inappropriate content",
    "Harassment or bullying",
    "Spam or misleading content",
    "Violation of community guidelines",
    "Fraud or scam",
    "Other"
  ];

  const submitReport = async () => {
    if (!reportReason || !reportDetails.trim()) {
      alert("Please select a reason and provide details for your report.");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const report = {
        id: Date.now(),
        reporterId: currentUser.id,
        targetUserId: targetUser.id,
        reason: reportReason,
        details: reportDetails.trim(),
        timestamp: new Date().toISOString(),
        status: "pending"
      };

      // Store report in localStorage (in a real app, this would be sent to a server)
      const existingReports = JSON.parse(localStorage.getItem('paros_reports') || '[]');
      existingReports.push(report);
      localStorage.setItem('paros_reports', JSON.stringify(existingReports));

      alert("Report submitted successfully. Our moderation team will review it shortly.");
      setIsSubmitting(false);
      setReportReason("");
      setReportDetails("");
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
      padding: "1rem"
    }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        style={{
          background: "white",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "500px",
          maxHeight: "80vh",
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <div style={{
          padding: "1.5rem",
          borderBottom: "1px solid #E8DCC0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#8B7355",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1.2rem",
              fontWeight: "bold"
            }}>
              {targetUser?.preferredName?.charAt(0) || targetUser?.name?.charAt(0)}
            </div>
            <div>
              <h3 style={{ margin: 0, color: "#231a13", fontSize: "1.2rem" }}>
                Report {targetUser?.preferredName || targetUser?.name}
              </h3>
              <p style={{ margin: "0.25rem 0 0 0", color: "#666", fontSize: "0.9rem" }}>
                Help us keep the community safe
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#666",
              padding: "0.5rem"
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "1.5rem" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "bold",
              color: "#231a13"
            }}>
              Reason for report *
            </label>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #E8DCC0",
                borderRadius: "8px",
                fontSize: "1rem",
                outline: "none"
              }}
            >
              <option value="">Select a reason...</option>
              {reportReasons.map(reason => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "bold",
              color: "#231a13"
            }}>
              Additional details *
            </label>
            <textarea
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              placeholder="Please provide specific details about the issue..."
              rows={4}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #E8DCC0",
                borderRadius: "8px",
                fontSize: "1rem",
                outline: "none",
                resize: "vertical",
                fontFamily: "inherit"
              }}
            />
          </div>

          <div style={{
            background: "#FFF8E1",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid #E8DCC0",
            marginBottom: "1.5rem"
          }}>
            <p style={{
              margin: 0,
              fontSize: "0.9rem",
              color: "#8B7355",
              fontWeight: "bold"
            }}>
              📋 Report Guidelines
            </p>
            <ul style={{
              margin: "0.5rem 0 0 0",
              paddingLeft: "1.2rem",
              fontSize: "0.85rem",
              color: "#666",
              lineHeight: 1.4
            }}>
              <li>Be specific about the issue</li>
              <li>Include relevant details and context</li>
              <li>Reports are anonymous and taken seriously</li>
              <li>False reports may result in account restrictions</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div style={{
          padding: "1rem 1.5rem",
          borderTop: "1px solid #E8DCC0",
          display: "flex",
          gap: "1rem",
          justifyContent: "flex-end"
        }}>
          <button
            onClick={onClose}
            style={{
              padding: "0.75rem 1.5rem",
              background: "none",
              color: "#666",
              border: "2px solid #E8DCC0",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            Cancel
          </button>
          <button
            onClick={submitReport}
            disabled={isSubmitting || !reportReason || !reportDetails.trim()}
            style={{
              padding: "0.75rem 1.5rem",
              background: (reportReason && reportDetails.trim() && !isSubmitting) ? "#8B7355" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: (reportReason && reportDetails.trim() && !isSubmitting) ? "pointer" : "not-allowed",
              fontSize: "1rem",
              fontWeight: "bold"
            }}
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ReportingModal;
