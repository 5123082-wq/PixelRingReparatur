import type { Prisma, PrimaryContactMethod } from '@prisma/client';

type CustomerProfileSyncInput = {
  caseId: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  preferredLanguage: string | null;
  preferredContactMethod: PrimaryContactMethod | null;
};

function normalizeEmail(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const email = value.trim().toLowerCase();

  if (!email || !email.includes('@')) {
    return null;
  }

  return email;
}

function normalizePhone(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const normalized = value
    .trim()
    .replace(/[\s().-]+/g, '')
    .replace(/^00/, '+');

  if (!normalized) {
    return null;
  }

  return normalized;
}

function hasText(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function choosePreferredProfile(
  byEmail: { id: string } | null,
  byPhone: { id: string } | null
): { id: string } | null {
  if (byEmail) {
    return byEmail;
  }

  if (byPhone) {
    return byPhone;
  }

  return null;
}

export async function syncCaseCustomerProfile(
  tx: Prisma.TransactionClient,
  input: CustomerProfileSyncInput
): Promise<string | null> {
  const emailNormalized = normalizeEmail(input.customerEmail);
  const phoneNormalized = normalizePhone(input.customerPhone);
  const displayName = hasText(input.customerName) ? input.customerName.trim() : null;

  if (!emailNormalized && !phoneNormalized) {
    await tx.case.update({
      where: { id: input.caseId },
      data: { customerProfileId: null },
      select: { id: true },
    });
    return null;
  }

  const [byEmail, byPhone] = await Promise.all([
    emailNormalized
      ? tx.customerProfile.findUnique({
          where: { emailNormalized },
          select: { id: true },
        })
      : Promise.resolve(null),
    phoneNormalized
      ? tx.customerProfile.findUnique({
          where: { phoneNormalized },
          select: { id: true },
        })
      : Promise.resolve(null),
  ]);

  const existingProfile = choosePreferredProfile(byEmail, byPhone);
  const hasIdentityConflict =
    byEmail && byPhone && byEmail.id !== byPhone.id;

  let profileId: string;

  if (existingProfile) {
    profileId = existingProfile.id;

    const profilePatch: Prisma.CustomerProfileUpdateInput = {};

    if (displayName) {
      profilePatch.displayName = displayName;
    }

    if (emailNormalized) {
      profilePatch.email = emailNormalized;
      profilePatch.emailNormalized = emailNormalized;
    }

    if (phoneNormalized && !hasIdentityConflict) {
      profilePatch.phone = phoneNormalized;
      profilePatch.phoneNormalized = phoneNormalized;
    }

    if (hasText(input.preferredLanguage)) {
      profilePatch.preferredLanguage = input.preferredLanguage.trim();
    }

    if (input.preferredContactMethod) {
      profilePatch.preferredContactMethod = input.preferredContactMethod;
    }

    await tx.customerProfile.update({
      where: { id: profileId },
      data: profilePatch,
      select: { id: true },
    });
  } else {
    const created = await tx.customerProfile.create({
      data: {
        displayName,
        email: emailNormalized,
        phone: phoneNormalized,
        emailNormalized,
        phoneNormalized,
        preferredLanguage: hasText(input.preferredLanguage)
          ? input.preferredLanguage.trim()
          : null,
        preferredContactMethod: input.preferredContactMethod,
      },
      select: { id: true },
    });

    profileId = created.id;
  }

  await tx.case.update({
    where: { id: input.caseId },
    data: { customerProfileId: profileId },
    select: { id: true },
  });

  return profileId;
}
