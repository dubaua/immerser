import type { SolidClassnamesByLayerId } from '../types';

interface IValidateImmerserMarkupParams {
  layerNodeArray: HTMLElement[];
  maskInnerSelector: string;
  maskNodeArray: HTMLElement[];
  rootNode: HTMLElement | null;
  solidClassnamesByLayerId: SolidClassnamesByLayerId;
}

export default function validateImmerserMarkup({
  layerNodeArray,
  maskInnerSelector,
  maskNodeArray,
  rootNode,
  solidClassnamesByLayerId,
}: IValidateImmerserMarkupParams): string[] {
  const messageArray: string[] = [];

  if (!rootNode) {
    messageArray.push('root node not found.');
  }
  if (layerNodeArray.length === 0) {
    messageArray.push('layer nodes not found.');
  }

  const layerIdSet = new Set<string>();
  layerNodeArray.forEach((layerNode, layerIndex) => {
    const { id } = layerNode;
    if (!id) {
      messageArray.push(`layer id not found for layer at index ${layerIndex}.`);
      return;
    }
    if (layerIdSet.has(id)) {
      messageArray.push(`duplicate layer id "${id}".`);
    }
    layerIdSet.add(id);
  });

  if (maskNodeArray.length > 0) {
    if (maskNodeArray.length !== layerNodeArray.length) {
      messageArray.push('existing markup mask count differs from count of layers.');
    }

    const maskLayerIdSet = new Set<string>();
    maskNodeArray.forEach((maskNode, maskIndex) => {
      const maskLayerId = maskNode.dataset.immerserLayerId;
      if (!maskNode.querySelector<HTMLElement>(maskInnerSelector)) {
        messageArray.push(`existing markup mask-inner not found for mask at index ${maskIndex}.`);
      }
      if (!maskLayerId) {
        messageArray.push(`existing markup mask layer id not found for mask at index ${maskIndex}.`);
        return;
      }
      if (maskLayerIdSet.has(maskLayerId)) {
        messageArray.push(`existing markup has duplicate mask layer id "${maskLayerId}".`);
      }
      if (!layerIdSet.has(maskLayerId)) {
        messageArray.push(`existing markup mask contains unknown layer id "${maskLayerId}".`);
      }
      maskLayerIdSet.add(maskLayerId);
    });

    layerIdSet.forEach((layerId) => {
      if (!maskLayerIdSet.has(layerId)) {
        messageArray.push(`existing markup mask not found for layer id "${layerId}".`);
      }
    });
  }

  if (
    !solidClassnamesByLayerId ||
    typeof solidClassnamesByLayerId !== 'object' ||
    Array.isArray(solidClassnamesByLayerId)
  ) {
    messageArray.push('solidClassnamesByLayerId must be an object');
    return messageArray;
  }

  const entries = Object.entries(solidClassnamesByLayerId);
  const hasInvalidEntry = entries.some(
    (entry) =>
      !entry[1] ||
      typeof entry[1] !== 'object' ||
      Array.isArray(entry[1]) ||
      Object.values(entry[1]).some((classname) => typeof classname !== 'string'),
  );
  if (hasInvalidEntry) {
    messageArray.push('solidClassnamesByLayerId entries must map solid ids to classname strings');
  }

  entries.forEach(([layerId]) => {
    if (!layerIdSet.has(layerId)) {
      messageArray.push(`solidClassnamesByLayerId contains unknown layer id "${layerId}"`);
    }
  });

  return messageArray;
}
