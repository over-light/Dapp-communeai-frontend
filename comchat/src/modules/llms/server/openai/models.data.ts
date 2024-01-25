import { LLM_IF_OAI_Chat, LLM_IF_OAI_Complete, LLM_IF_OAI_Fn, LLM_IF_OAI_Vision } from '../../store-llms';

import type { ModelDescriptionSchema } from '../llm.server.types';
import { wireMistralModelsListOutputSchema } from './mistral.wiretypes';
import { wireOpenrouterModelsListOutputSchema } from './openrouter.wiretypes';
import { wireTogetherAIListOutputSchema } from '~/modules/llms/server/openai/togetherai.wiretypes';


// [Azure] / [OpenAI]
const _knownOpenAIChatModels: ManualMappings = [
  // GPT4 Turbo
  {
    idPrefix: 'gpt-4-1106-preview',
    label: '4-Turbo (1106)',
    description: '128k context, fresher knowledge, cheaper than GPT-4.',
    contextWindow: 128000,
    maxCompletionTokens: 4096,
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn],
    latest: true,
  },
  {
    idPrefix: 'gpt-4-vision-preview',
    label: '4-Turbo (Vision)',
    description: 'Vision support, 128k context, fresher knowledge, cheaper than GPT-4.',
    contextWindow: 128000,
    maxCompletionTokens: 4096,
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn, LLM_IF_OAI_Vision],
    latest: true,
    hidden: true,
  },

  // GPT4-32k's
  {
    idPrefix: 'gpt-4-32k-0314',
    label: 'GPT-4-32k (0314)',
    description: 'Snapshot of gpt-4-32 from March 14th 2023. Will be deprecated on June 13th 2024 at the earliest.',
    contextWindow: 32768,
    interfaces: [LLM_IF_OAI_Chat],
    hidden: true,
  },
  {
    idPrefix: 'gpt-4-32k-0613',
    label: 'GPT-4-32k (0613)',
    description: 'Snapshot of gpt-4-32 from June 13th 2023.',
    contextWindow: 32768,
    interfaces: [LLM_IF_OAI_Chat],
  },
  {
    idPrefix: 'gpt-4-32k',
    label: 'GPT-4-32k',
    description: 'Largest context window for big problems',
    contextWindow: 32768,
    interfaces: [LLM_IF_OAI_Chat],
  },

  // GPT4's
  {
    idPrefix: 'gpt-4-0613',
    label: 'GPT-4 (0613)',
    description: 'Snapshot of gpt-4 from June 13th 2023 with function calling data.',
    contextWindow: 8192,
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn],
  },
  {
    idPrefix: 'gpt-4-0314',
    label: 'GPT-4 (0314)',
    description: 'Snapshot of gpt-4 from March 14th 2023 with function calling data.',
    contextWindow: 8192,
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn],
    hidden: true,
  },
  {
    idPrefix: 'gpt-4',
    label: 'GPT-4',
    description: 'Insightful, big thinker, slower, pricey',
    contextWindow: 8192,
    interfaces: [LLM_IF_OAI_Chat],
    hidden: true,
  },


  // 3.5-Turbo-16k's
  {
    idPrefix: 'gpt-3.5-turbo-1106',
    label: '3.5-Turbo-16k (1106)',
    description: 'Snapshot of gpt-3.5-turbo-16k from November 6th 2023.',
    contextWindow: 16385,
    maxCompletionTokens: 4096,
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn],
    latest: true,
  },
  {
    idPrefix: 'gpt-3.5-turbo-16k-0613',
    label: '3.5-Turbo-16k (0613)',
    description: 'Snapshot of gpt-3.5-turbo-16k from June 13th 2023.',
    contextWindow: 16385,
    interfaces: [LLM_IF_OAI_Chat],
    hidden: true,
  },
  {
    idPrefix: 'gpt-3.5-turbo-16k',
    label: '3.5-Turbo-16k',
    description: 'Same capabilities as the standard gpt-3.5-turbo model but with 4 times the context.',
    contextWindow: 16385,
    interfaces: [LLM_IF_OAI_Chat],
    hidden: true,
  },

  // 3.5-Turbo-Instruct
  {
    idPrefix: 'gpt-3.5-turbo-instruct',
    label: '3.5-Turbo-Instruct',
    description: 'Not for chat.',
    contextWindow: 4097,
    interfaces: [LLM_IF_OAI_Complete],
    hidden: true,
  },

  // 3.5-Turbo's
  {
    idPrefix: 'gpt-3.5-turbo-0301',
    label: '3.5-Turbo (0301)',
    description: 'Snapshot of gpt-3.5-turbo from March 1st 2023. Will be deprecated on June 13th 2024 at the earliest.',
    contextWindow: 4097,
    hidden: true,
    interfaces: [LLM_IF_OAI_Chat],
  },
  {
    idPrefix: 'gpt-3.5-turbo-0613',
    label: '3.5-Turbo (0613)',
    description: 'Snapshot of gpt-3.5-turbo from June 13th 2023 with function calling data.',
    contextWindow: 4097,
    interfaces: [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn],
    hidden: true,
  },
  {
    idPrefix: 'gpt-3.5-turbo',
    label: '3.5-Turbo',
    description: 'Fair speed and smarts.',
    contextWindow: 4097,
    hidden: true,
    interfaces: [LLM_IF_OAI_Chat],
  },


  // Azure variants - because someone forgot the dot
  {
    idPrefix: 'gpt-35-turbo-16k',
    label: '3.5-Turbo-16k',
    description: 'Fair speed and smarts, large context',
    contextWindow: 16384,
    interfaces: [LLM_IF_OAI_Chat], // as azure doesn't version model id's (in the deployments), let's assume no function calling
  },
  {
    idPrefix: 'gpt-35-turbo',
    label: '3.5-Turbo',
    contextWindow: 4097,
    description: 'Fair speed and smarts',
    interfaces: [LLM_IF_OAI_Chat], // as azure doesn't version model id's (in the deployments), let's assume no function calling
  },

  // Fallback - unknown
  {
    idPrefix: '',
    label: '?:',
    description: 'Unknown, please let us know the ID. Assuming a 4097 context window size and Chat capabilities.',
    contextWindow: 4097,
    interfaces: [LLM_IF_OAI_Chat],
    hidden: true,
  },
];

export function openAIModelToModelDescription(modelId: string, modelCreated: number, modelUpdated?: number): ModelDescriptionSchema {
  return fromManualMapping(_knownOpenAIChatModels, modelId, modelCreated, modelUpdated);
}


// [LM Studio]
export function lmStudioModelToModelDescription(modelId: string): ModelDescriptionSchema {

  // LM Studio model ID's are the file names of the model files
  function getFileName(filePath: string): string {
    const normalizedPath = filePath.replace(/\\/g, '/');
    return normalizedPath.split('/').pop() || '';
  }

  return fromManualMapping([], modelId, undefined, undefined, {
    idPrefix: modelId,
    label: getFileName(modelId)
      .replace('.gguf', '')
      .replace('.bin', ''),
    // .replaceAll('-', ' '),
    description: `Unknown LM Studio model. File: ${modelId}`,
    contextWindow: null, // 'not provided'
    interfaces: [LLM_IF_OAI_Chat], // assume..
  });
}


// [LocalAI]
const _knownLocalAIChatModels: ManualMappings = [
  {
    idPrefix: 'ggml-gpt4all-j',
    label: 'GPT4All-J',
    description: 'GPT4All-J on LocalAI',
    contextWindow: 2048,
    interfaces: [LLM_IF_OAI_Chat],
  },
  {
    idPrefix: 'luna-ai-llama2',
    label: 'Luna AI Llama2 Uncensored',
    description: 'Luna AI Llama2 on LocalAI',
    contextWindow: 4096,
    interfaces: [LLM_IF_OAI_Chat],
  },
];

export function localAIModelToModelDescription(modelId: string): ModelDescriptionSchema {
  return fromManualMapping(_knownLocalAIChatModels, modelId, undefined, undefined, {
    idPrefix: modelId,
    label: modelId
      .replace('ggml-', '')
      .replace('.bin', '')
      .replaceAll('-', ' '),
    description: 'Unknown localAI model. Please update `models.data.ts` with this ID',
    contextWindow: null, // 'not provided'
    interfaces: [LLM_IF_OAI_Chat], // assume..
  });
}


// [Mistral]

const _knownMistralChatModels: ManualMappings = [
  {
    idPrefix: 'mistral-medium',
    label: 'Mistral Medium',
    description: 'Mistral internal prototype model.',
    contextWindow: 32768,
    interfaces: [LLM_IF_OAI_Chat],
  },
  {
    idPrefix: 'mistral-small',
    label: 'Mistral Small',
    description: 'Higher reasoning capabilities and more capabilities (English, French, German, Italian, Spanish, and Code)',
    contextWindow: 32768,
    interfaces: [LLM_IF_OAI_Chat],
  },
  {
    idPrefix: 'mistral-tiny',
    label: 'Mistral Tiny',
    description: 'Used for large batch processing tasks where cost is a significant factor but reasoning capabilities are not crucial',
    contextWindow: 32768,
    interfaces: [LLM_IF_OAI_Chat],
  },
  {
    idPrefix: 'mistral-embed',
    label: 'Mistral Embed',
    description: 'Mistral Medium on Mistral',
    // output: 1024 dimensions
    maxCompletionTokens: 1024, // HACK - it's 1024 dimensions, but those are not 'completion tokens'
    contextWindow: 32768, // actually unknown, assumed from the other models
    interfaces: [],
    hidden: true,
  },
];

export function mistralModelToModelDescription(_model: unknown): ModelDescriptionSchema {
  const model = wireMistralModelsListOutputSchema.parse(_model);
  return fromManualMapping(_knownMistralChatModels, model.id, model.created, undefined, {
    idPrefix: model.id,
    label: model.id.replaceAll(/[_-]/g, ' '),
    description: 'New Mistral Model',
    contextWindow: 32768,
    interfaces: [LLM_IF_OAI_Chat], // assume..
    hidden: true,
  });
}

export function mistralModelsSort(a: ModelDescriptionSchema, b: ModelDescriptionSchema): number {
  if (a.hidden && !b.hidden)
    return 1;
  if (!a.hidden && b.hidden)
    return -1;
  return a.id.localeCompare(b.id);
}


// [Oobabooga]
const _knownOobaboogaChatModels: ManualMappings = [];

const _knownOobaboogaNonChatModels: string[] = [
  'None', 'text-curie-001', 'text-davinci-002', 'all-mpnet-base-v2', 'text-embedding-ada-002',
  /* 'gpt-3.5-turbo' // used to be here, but now it's the way to select the activly loaded ooababooga model */
];

export function oobaboogaModelToModelDescription(modelId: string, created: number): ModelDescriptionSchema {
  let label = modelId.replaceAll(/[_-]/g, ' ').split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
  if (label.endsWith('.bin'))
    label = label.slice(0, -4);

  // special case for the default (and only 'chat') model
  if (modelId === 'gpt-3.5-turbo')
    label = 'Oobabooga Model';

  return fromManualMapping(_knownOobaboogaChatModels, modelId, created, undefined, {
    idPrefix: modelId,
    label: label,
    description: 'Oobabooga model',
    contextWindow: 4096, // FIXME: figure out how to the context window size from Oobabooga
    interfaces: [LLM_IF_OAI_Chat], // assume..
    hidden: _knownOobaboogaNonChatModels.includes(modelId),
  });
}


// [OpenRouter]

const orOldModelIDs = [
  'openai/gpt-3.5-turbo-0301', 'openai/gpt-4-0314', 'openai/gpt-4-32k-0314', 'openai/text-davinci-002',
  'anthropic/claude-v1', 'anthropic/claude-1.2', 'anthropic/claude-instant-v1-100k', 'anthropic/claude-v1-100k', 'anthropic/claude-instant-1.0',
];

const orModelFamilyOrder = [
  // great models (pickes by hand, they're free)
  'mistralai/mistral-7b-instruct', 'nousresearch/nous-capybara-7b',
  // great orgs
  'huggingfaceh4/', 'openchat/', 'anthropic/', 'google/', 'mistralai/', 'openai/', 'meta-llama/', 'phind/',
];

export function openRouterModelFamilySortFn(a: { id: string }, b: { id: string }): number {
  const aPrefixIndex = orModelFamilyOrder.findIndex(prefix => a.id.startsWith(prefix));
  const bPrefixIndex = orModelFamilyOrder.findIndex(prefix => b.id.startsWith(prefix));

  // If both have a prefix, sort by prefix first, and then alphabetically
  if (aPrefixIndex !== -1 && bPrefixIndex !== -1)
    return aPrefixIndex !== bPrefixIndex ? aPrefixIndex - bPrefixIndex : a.id.localeCompare(b.id);

  // If one has a prefix and the other doesn't, prioritize the one with prefix
  return aPrefixIndex !== -1 ? -1 : 1;
}

export function openRouterModelToModelDescription(wireModel: object): ModelDescriptionSchema {

  // parse the model
  const model = wireOpenrouterModelsListOutputSchema.parse(wireModel);

  // parse pricing
  const pricing = {
    cpmPrompt: parseFloat(model.pricing.prompt),
    cpmCompletion: parseFloat(model.pricing.completion),
  };
  const isFree = pricing.cpmPrompt === 0 && pricing.cpmCompletion === 0;

  // openrouter provides the fields we need as part of the model object
  let label = model.name || model.id.replace('/', ' · ');
  if (isFree)
    label += ' · 🎁'; // Free? Discounted?

  // hidden: hide by default older models or models not in known families
  const hidden = orOldModelIDs.includes(model.id) || !orModelFamilyOrder.some(prefix => model.id.startsWith(prefix));

  return fromManualMapping([], model.id, undefined, undefined, {
    idPrefix: model.id,
    // latest: ...
    label,
    // created: ...
    // updated: ...
    description: model.description,
    contextWindow: model.context_length || 4096,
    maxCompletionTokens: model.top_provider.max_completion_tokens || undefined,
    pricing,
    interfaces: [LLM_IF_OAI_Chat],
    hidden,
  });
}


// [Together AI]

const _knownTogetherAIChatModels: ManualMappings = [
  {
    idPrefix: 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO',
    label: 'Nous Hermes 2 - Mixtral 8x7B-DPO',
    description: 'Nous Hermes 2 Mixtral 7bx8 DPO is the new flagship Nous Research model trained over the Mixtral 7bx8 MoE LLM. The model was trained on over 1,000,000 entries of primarily GPT-4 generated data, as well as other high quality data from open datasets across the AI landscape, achieving state of the art performance on a variety of tasks.',
    contextWindow: 32768,
    pricing: {
      cpmPrompt: 0.0006,
      cpmCompletion: 0.0006,
    },
    interfaces: [LLM_IF_OAI_Chat],
  },
  {
    idPrefix: 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-SFT',
    label: 'Nous Hermes 2 - Mixtral 8x7B-SFT',
    description: 'Nous Hermes 2 Mixtral 7bx8 SFT is the new flagship Nous Research model trained over the Mixtral 7bx8 MoE LLM. The model was trained on over 1,000,000 entries of primarily GPT-4 generated data, as well as other high quality data from open datasets across the AI landscape, achieving state of the art performance on a variety of tasks.',
    contextWindow: 32768,
    pricing: {
      cpmPrompt: 0.0006,
      cpmCompletion: 0.0006,
    },
    interfaces: [LLM_IF_OAI_Chat],
  },
  {
    idPrefix: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
    label: 'Mixtral-8x7B Instruct',
    description: 'The Mixtral-8x7B Large Language Model (LLM) is a pretrained generative Sparse Mixture of Experts.',
    contextWindow: 32768,
    pricing: {
      cpmPrompt: 0.0006,
      cpmCompletion: 0.0006,
    },
    interfaces: [LLM_IF_OAI_Chat],
  },
  {
    idPrefix: 'mistralai/Mistral-7B-Instruct-v0.2',
    label: 'Mistral (7B) Instruct v0.2',
    description: 'The Mistral-7B-Instruct-v0.2 Large Language Model (LLM) is an improved instruct fine-tuned version of Mistral-7B-Instruct-v0.1.',
    contextWindow: 32768,
    pricing: {
      cpmPrompt: 0.0002,
      cpmCompletion: 0.0002,
    },
    interfaces: [LLM_IF_OAI_Chat],
  },
  {
    idPrefix: 'NousResearch/Nous-Hermes-2-Yi-34B',
    label: 'Nous Hermes-2 Yi (34B)',
    description: 'Nous Hermes 2 - Yi-34B is a state of the art Yi Fine-tune',
    contextWindow: 4097,
    pricing: {
      cpmPrompt: 0.0008,
      cpmCompletion: 0.0008,
    },
    interfaces: [LLM_IF_OAI_Chat],
  },
];

export function togetherAIModelsToModelDescriptions(wireModels: unknown): ModelDescriptionSchema[] {

  function togetherAIModelToModelDescription(model: { id: string, created: number }) {
    return fromManualMapping(_knownTogetherAIChatModels, model.id, model.created, undefined, {
      idPrefix: model.id,
      label: model.id.replaceAll('/', ' · ').replaceAll(/[_-]/g, ' '),
      description: 'New Togehter AI Model',
      contextWindow: null, // unknown
      interfaces: [LLM_IF_OAI_Chat], // assume..
      hidden: true,
    });
  }

  function togetherAIModelsSort(a: ModelDescriptionSchema, b: ModelDescriptionSchema): number {
    if (a.hidden && !b.hidden)
      return 1;
    if (!a.hidden && b.hidden)
      return -1;
    if (a.created !== b.created)
      return (b.created || 0) - (a.created || 0);
    return a.id.localeCompare(b.id);
  }

  return wireTogetherAIListOutputSchema.parse(wireModels)
    .map(togetherAIModelToModelDescription)
    .sort(togetherAIModelsSort);
}


// Helpers

type ManualMappings = ManualMapping[];
type ManualMapping = ({ idPrefix: string, latest?: boolean } & Omit<ModelDescriptionSchema, 'id' | 'created' | 'updated'>);

function fromManualMapping(mappings: ManualMappings, id: string, created?: number, updated?: number, fallback?: ManualMapping): ModelDescriptionSchema {

  // find the closest known model, or fall back, or take the last
  const known = mappings.find(base => id.startsWith(base.idPrefix)) || fallback || mappings[mappings.length - 1];

  // check whether this is a partial map, which indicates an unknown/new variant
  const suffix = id.slice(known.idPrefix.length).trim();

  // return the model description sheet
  return {
    id,
    label: (known.latest ? '🌟 ' : '') + known.label + (suffix ? ` [${suffix.replaceAll('-', ' ').trim()}]` : ''),
    created: created || 0,
    updated: updated || created || 0,
    description: known.description,
    contextWindow: known.contextWindow,
    ...(!!known.maxCompletionTokens && { maxCompletionTokens: known.maxCompletionTokens }),
    ...(!!known.pricing && { pricing: known.pricing }),
    interfaces: known.interfaces,
    ...(!!known.hidden && { hidden: known.hidden }),
  };
}