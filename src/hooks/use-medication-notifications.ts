import { useEffect, useMemo, useState } from "react";
import { toast } from "@/hooks/use-toast";
import {
  MEDICATION_NOTIFICATION_SLOTS_STORAGE_KEY,
  MEDICATION_NOTIFICATIONS_STORAGE_KEY,
  MEDICATIONS_STORAGE_KEY,
} from "@/lib/storage-keys";

type Medication = {
  id: string;
  name: string;
  times: string[];
  active?: boolean;
};

export type MedicationNotification = {
  id: string;
  medicationId: string;
  message: string;
  scheduledTime: string;
  alertedAt: string;
  read: boolean;
};

const CHECK_INTERVAL_MS = 30_000;

const getCurrentTimeSlot = (date: Date) => {
  const hour = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  return `${hour}:${minutes}`;
};

const getCurrentDateSlot = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const readJson = <T,>(key: string, fallback: T): T => {
  const value = localStorage.getItem(key);
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export function useMedicationNotifications() {
  const [notifications, setNotifications] = useState<MedicationNotification[]>([]);

  useEffect(() => {
    setNotifications(readJson<MedicationNotification[]>(MEDICATION_NOTIFICATIONS_STORAGE_KEY, []));
  }, []);

  useEffect(() => {
    localStorage.setItem(MEDICATION_NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const checkMedicationAlerts = () => {
      const now = new Date();
      const currentTimeSlot = getCurrentTimeSlot(now);
      const currentDateSlot = getCurrentDateSlot(now);

      const medications = readJson<Medication[]>(MEDICATIONS_STORAGE_KEY, []);
      const alertedSlots = new Set(readJson<string[]>(MEDICATION_NOTIFICATION_SLOTS_STORAGE_KEY, []));

      const dueNotifications: MedicationNotification[] = [];

      for (const medication of medications) {
        if (medication.active === false || !Array.isArray(medication.times)) continue;

        for (const time of medication.times) {
          const normalizedTime = time.trim();
          if (normalizedTime !== currentTimeSlot) continue;

          const slotKey = `${currentDateSlot}:${medication.id}:${normalizedTime}`;
          if (alertedSlots.has(slotKey)) continue;

          dueNotifications.push({
            id: `${Date.now()}-${medication.id}-${normalizedTime}`,
            medicationId: medication.id,
            message: `Hora de tomar ${medication.name}`,
            scheduledTime: normalizedTime,
            alertedAt: now.toISOString(),
            read: false,
          });

          alertedSlots.add(slotKey);
        }
      }

      if (dueNotifications.length === 0) return;

      setNotifications((previous) => [...dueNotifications, ...previous]);
      localStorage.setItem(MEDICATION_NOTIFICATION_SLOTS_STORAGE_KEY, JSON.stringify(Array.from(alertedSlots)));

      dueNotifications.forEach((notification) => {
        toast({
          title: "Notificação de medicamento",
          description: `${notification.message} (${notification.scheduledTime})`,
        });
      });
    };

    checkMedicationAlerts();
    const interval = window.setInterval(checkMedicationAlerts, CHECK_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, []);

  const unreadCount = useMemo(() => notifications.filter((notification) => !notification.read).length, [notifications]);

  const markAllAsRead = () => {
    setNotifications((previous) => previous.map((notification) => ({ ...notification, read: true })));
  };

  return {
    notifications,
    unreadCount,
    markAllAsRead,
  };
}
