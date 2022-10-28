import type {
  FindAnswersOptions,
  FindAnswersResponse,
  SearchOptions,
} from '@algolia/client-search';
import type { SearchClient } from 'algoliasearch/lite';

export type DocHit = {
  title: string;
  page_title: string;
  description: string;
  tags: string[];
  details: {
    questions: string[];
    is_token: boolean;
  };
  level: number;
  variations: string[];
  languages: string[];
  url: string;
  base_url: string;
  hierarchy_level: number;
  hierarchy: string[];
  anchor: string;
  toc: Array<{
    anchor: string;
    title: string;
  }>;
  snippets: Record<string, unknown>;
  content_structure: {
    lvl0: string;
    lvl1?: string;
    lvl2?: string;
    lvl3?: string;
    lvl4?: string;
    lvl5?: string;
  };
  content_type: string;
  type: string;
  type_level: number;
  category: string;
  objectID: string;
};

export type DiscourseHit = {
  url: string;
  post_number: number;
  image_url: string;
  content: string;
  topic: {
    id: number;
    url: string;
    title: string;
    views: number;
    slug: string;
    like_count: number;
    tags: string[];
  };
};

const zendeskExampleHit = {
  locale: {
    locale: 'en-us',
    name: 'English',
    rtl: false,
  },
  id: '360019303798',
  updated_at: 18730,
  position: 0,
  title: 'How can agents leverage knowledge to help customers?',
  body_safe:
    ' You can use our  Knowledge Capture app  to leverage your team’s collective knowledge. \n Using the app, agents can:\n  \n   Search the Help Center without leaving the ticket \n   Insert links to relevant Help Center articles in ticket comments \n   Add inline feedback to existing articles that need updates \n   Create new articles while answering tickets using a pre-defined template \n \n\n\n Agents never have to leave the ticket interface to share, flag, or create knowledge, so they can help the customer, while also improving your self-service offerings for other customers. \n\n To get started, see our  Knowledge Capture documentation . \n\n And before your agents can start creating new knowledge directly from tickets, you’ll need to  create a template  for them to use. To help you along, we’ve provided some template ideas below. You can copy and paste any sample template below into a new article, add the  KCTemplate  label to the article, and you’ll be all set. \n\n Q&A template: \n\n \n\n \n \n [Title] \n\n\n \n \n Question \nwrite the question here.\n\n\n \n \n Answer \nwrite the answer here.\n\n\n \n\n Solution template: \n\n \n\n \n \n [Title] \n\n\n \n \n Symptoms \nwrite the symptoms here.\n\n\n \n \n Resolution \nwrite the resolution here.\n\n\n \n \n Cause \nwrite the cause here.\n\n\n \n\n How-to template: \n\n \n\n \n \n [Title] \n\n\n \n \n Objective \nwrite the purpose or task here.\n\n\n \n \n Procedure \nwrite the steps here.\n\n\n \n',
  outdated: false,
  promoted: false,
  vote_sum: 0,
  comments_disabled: false,
  category: {
    id: '360003572138',
    title: 'General',
  },
  section: {
    id: '360005535398',
    title: 'FAQ',
    full_path: 'General > FAQ',
    user_segment: 'everybody',
  },
  user_segment: 'everybody',
  label_names: [],
  created_at_iso: '2021-04-13T21:41:32Z',
  updated_at_iso: '2021-04-13T21:41:32Z',
  edited_at: 18730,
  edited_at_iso: '2021-04-13T21:41:32Z',
  objectID: '360041173778',
};

export type ZendeskHit = typeof zendeskExampleHit;
export type AcademyHit = {
  description: string;
  id: string;
  last_updated_by_id: number;
  content: string;
  course_id: string;
  item_folder_id: string;
  guide_title: string;
  last_updated_by_name: string;
  name: string;
  banner_image: null;
  object_tags: string[];
  parent_object_id: string;
  section_title: string;
  type: string;
  updated_at: number;
  academy_ids: number[];
  academy_collection_ids: number[];
  _tags: string[];
  objectID: string;
};

export type FederatedHits = DocHit & DiscourseHit & ZendeskHit & AcademyHit;

export type SourceId =
  | 'documentation'
  | 'community'
  | 'help center'
  | 'academy';
export interface Source {
  sourceId: SourceId;
  indexName: string;
  client: SearchClient;
  searchParams?: SearchOptions;
  searchUrl: string;
}

export type HitWithAnswer<T> = FindAnswersResponse<T>['hits'][0];
