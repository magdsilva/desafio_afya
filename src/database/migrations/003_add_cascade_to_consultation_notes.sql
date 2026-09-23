ALTER TABLE consultation_notes
DROP CONSTRAINT fk_consultation_notes_appointment;

ALTER TABLE consultation_notes
ADD CONSTRAINT fk_consultation_notes_appointment
FOREIGN KEY (appointment_id)
REFERENCES appointments(id)
ON DELETE CASCADE;