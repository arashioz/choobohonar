const blocked = [
  "کیر",
  "کص",
  "کسکش",
  "کصکش",
  "جنده",
  "حروم",
  "خارکصه",
  "خارکس",
  "گوه",
  "گه خور",
  "عنتر",
  "کونی",
  "لاشی",
  "بیناموس",
  "مادرجنده",
  "ننه",
  "fuck",
  "shit",
  "bitch",
  "asshole",
];

export type Moderation = { ok: true } | { ok: false; reason: string };

function letters(value: string) {
  return value.replace(/[^\p{L}\p{N}]+/gu, "");
}

export function moderateExperience(name: string, note: string): Moderation {
  const cleanName = name.trim().replace(/\s+/g, " ");
  const cleanNote = note.trim().replace(/\s+/g, " ");
  const haystack = `${cleanName} ${cleanNote}`.toLowerCase();

  if (cleanName.length < 2) {
    return { ok: false, reason: "نام را کامل‌تر بنویسید." };
  }
  if (letters(cleanNote).length < 12 || cleanNote.split(" ").length < 2) {
    return { ok: false, reason: "نظر باید یک جملهٔ روشن باشد." };
  }
  if (/(.)\1{4,}/u.test(cleanNote) || /(https?:|www\.|@)/i.test(cleanNote)) {
    return { ok: false, reason: "این متن برای دیوار نمایشگاه مناسب نیست." };
  }
  if (blocked.some((word) => haystack.includes(word))) {
    return { ok: false, reason: "این متن برای دیوار نمایشگاه مناسب نیست." };
  }

  return { ok: true };
}
