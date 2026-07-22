export type ReferenzenValidationIssue = {
  code:
    | 'BLOCK_KEY_DUPLICATE'
    | 'BLOCK_KEY_UNSUPPORTED'
    | 'BLOCK_TYPE_INVALID'
    | 'BLOCK_FIELD_EMPTY'
    | 'BLOCK_ITEM_FIELD_EMPTY'
    | 'BLOCK_ITEM_ID_DUPLICATE'
    | 'BLOCK_ITEM_COUNT_INVALID';
  blockKey: string;
  fieldPath: string;
  message: string;
};

type ReferenzenBlock = Record<string, unknown> & {
  type?: unknown;
  key?: unknown;
  enabled?: unknown;
};

type BlockRule = {
  type: string;
  required?: boolean;
  fields?: string[];
  itemFields?: string[];
  requireItemId?: boolean;
  minimumItems?: number;
};

const BLOCK_RULES: Record<string, BlockRule> = {
  heroBlock: {
    type: 'hero',
    fields: ['title', 'intro'],
  },
  recentIntroBlock: {
    type: 'textSection',
    fields: ['pretitle', 'title', 'description'],
  },
  casesBlock: {
    type: 'cardList',
    itemFields: [
      'id',
      'title',
      'category',
      'problem',
      'work',
      'result',
      'defaultText',
      'beforeText',
      'beforeImage',
      'afterImage',
      'beforeAlt',
      'afterAlt',
    ],
    requireItemId: true,
  },
  reportIntroBlock: {
    type: 'textSection',
    fields: ['title', 'image', 'imageAlt'],
  },
  reportHooksBlock: {
    type: 'cardList',
    itemFields: ['id', 'title', 'text'],
    requireItemId: true,
  },
  reportsBlock: {
    type: 'cardList',
    itemFields: ['id', 'type', 'issue', 'outcome'],
    requireItemId: true,
  },
  galleryIntroBlock: {
    type: 'textSection',
    fields: ['pretitle', 'sectionTitle', 'title', 'description'],
  },
  galleryItemsBlock: {
    type: 'cardList',
    itemFields: ['id', 'title', 'category', 'image', 'imageAlt', 'description'],
    requireItemId: true,
  },
  promoBlock: {
    type: 'cta',
    fields: ['badge', 'title', 'description', 'primaryLabel', 'requestHref'],
  },
  typeBandLinesBlock: {
    type: 'cardList',
    itemFields: ['text'],
    minimumItems: 3,
  },
  finalCtaBlock: {
    type: 'cta',
    fields: ['badge', 'title', 'description', 'primaryLabel'],
  },
  labelsBlock: {
    type: 'labels',
    required: true,
    fields: [
      'modalProblemLabel',
      'modalWorkLabel',
      'modalResultLabel',
      'modalBeforeLabel',
      'modalCta',
      'viewerAllLabel',
      'viewerCloseLabel',
    ],
  },
};

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function addIssue(
  issues: ReferenzenValidationIssue[],
  issue: ReferenzenValidationIssue
): void {
  issues.push(issue);
}

function validateItemFields(
  block: ReferenzenBlock,
  blockKey: string,
  rule: BlockRule,
  issues: ReferenzenValidationIssue[]
): Record<string, unknown>[] {
  const rawItems = block.items;

  if (!Array.isArray(rawItems)) {
    addIssue(issues, {
      code: 'BLOCK_FIELD_EMPTY',
      blockKey,
      fieldPath: `${blockKey}.items`,
      message: `${blockKey}.items must be an array.`,
    });
    return [];
  }

  if (rule.minimumItems && rawItems.length < rule.minimumItems) {
    addIssue(issues, {
      code: 'BLOCK_ITEM_COUNT_INVALID',
      blockKey,
      fieldPath: `${blockKey}.items`,
      message: `${blockKey}.items requires at least ${rule.minimumItems} items.`,
    });
  }

  const items: Record<string, unknown>[] = [];
  const ids = new Set<string>();

  rawItems.forEach((rawItem, itemIndex) => {
    const itemPath = `${blockKey}.items[${itemIndex}]`;

    if (!isObject(rawItem)) {
      addIssue(issues, {
        code: 'BLOCK_ITEM_FIELD_EMPTY',
        blockKey,
        fieldPath: itemPath,
        message: `${itemPath} must be an object.`,
      });
      return;
    }

    items.push(rawItem);

    for (const field of rule.itemFields ?? []) {
      if (!hasText(rawItem[field])) {
        addIssue(issues, {
          code: 'BLOCK_ITEM_FIELD_EMPTY',
          blockKey,
          fieldPath: `${itemPath}.${field}`,
          message: `${itemPath}.${field} is required before publishing.`,
        });
      }
    }

    if (blockKey === 'casesBlock') {
      for (const slot of [1, 2, 3]) {
        const imageField = `galleryImage${slot}`;
        const altField = `galleryAlt${slot}`;
        if (hasText(rawItem[imageField]) && !hasText(rawItem[altField])) {
          addIssue(issues, {
            code: 'BLOCK_ITEM_FIELD_EMPTY',
            blockKey,
            fieldPath: `${itemPath}.${altField}`,
            message: `${itemPath}.${altField} is required when ${imageField} is set.`,
          });
        }
      }
    }

    if (rule.requireItemId && hasText(rawItem.id)) {
      const id = rawItem.id.trim();
      if (ids.has(id)) {
        addIssue(issues, {
          code: 'BLOCK_ITEM_ID_DUPLICATE',
          blockKey,
          fieldPath: `${itemPath}.id`,
          message: `${itemPath}.id duplicates another item id (${id}).`,
        });
      }
      ids.add(id);
    }
  });

  return items;
}

export function getReferenzenPublishIssues(
  blocks: ReferenzenBlock[],
  _locale: string
): ReferenzenValidationIssue[] {
  void _locale;
  const issues: ReferenzenValidationIssue[] = [];
  const seenBlockKeys = new Set<string>();
  const blocksByKey = new Map<string, ReferenzenBlock>();

  for (const block of blocks) {
    if (!hasText(block.key)) continue;
    const blockKey = block.key.trim();

    if (!BLOCK_RULES[blockKey]) {
      addIssue(issues, {
        code: 'BLOCK_KEY_UNSUPPORTED',
        blockKey,
        fieldPath: blockKey,
        message: `Block key ${blockKey} is not supported by the Referenzen layout.`,
      });
      continue;
    }

    if (seenBlockKeys.has(blockKey)) {
      addIssue(issues, {
        code: 'BLOCK_KEY_DUPLICATE',
        blockKey,
        fieldPath: blockKey,
        message: `Block key ${blockKey} is duplicated.`,
      });
      continue;
    }

    seenBlockKeys.add(blockKey);
    blocksByKey.set(blockKey, block);
  }

  const validatedItems = new Map<string, Record<string, unknown>[]>();

  for (const [blockKey, rule] of Object.entries(BLOCK_RULES)) {
    const block = blocksByKey.get(blockKey);
    if (!block) {
      if (rule.required) {
        addIssue(issues, {
          code: 'BLOCK_FIELD_EMPTY',
          blockKey,
          fieldPath: blockKey,
          message: `${blockKey} is required by the Referenzen interface.`,
        });
      }
      continue;
    }

    if (block.enabled === false) {
      if (rule.required) {
        addIssue(issues, {
          code: 'BLOCK_FIELD_EMPTY',
          blockKey,
          fieldPath: `${blockKey}.enabled`,
          message: `${blockKey} cannot be hidden because it supplies interface labels.`,
        });
      }
      continue;
    }

    if (block.type !== rule.type) {
      addIssue(issues, {
        code: 'BLOCK_TYPE_INVALID',
        blockKey,
        fieldPath: `${blockKey}.type`,
        message: `${blockKey}.type must be ${rule.type}.`,
      });
    }

    for (const field of rule.fields ?? []) {
      if (!hasText(block[field])) {
        addIssue(issues, {
          code: 'BLOCK_FIELD_EMPTY',
          blockKey,
          fieldPath: `${blockKey}.${field}`,
          message: `${blockKey}.${field} is required before publishing.`,
        });
      }
    }

    if (rule.itemFields) {
      validatedItems.set(
        blockKey,
        validateItemFields(block, blockKey, rule, issues)
      );
    }

    if (blockKey === 'heroBlock') {
      const hasHeroImage = [1, 2, 3, 4, 5].some((slot) =>
        hasText(block[`heroImage${slot}`])
      );
      if (!hasHeroImage) {
        addIssue(issues, {
          code: 'BLOCK_FIELD_EMPTY',
          blockKey,
          fieldPath: `${blockKey}.heroImage1`,
          message: `${blockKey} requires at least one hero image before publishing.`,
        });
      }
    }
  }

  return issues;
}

export function validateReferenzenBlocksForPublish(
  blocks: ReferenzenBlock[],
  locale: string
): string | null {
  return getReferenzenPublishIssues(blocks, locale)[0]?.message ?? null;
}
