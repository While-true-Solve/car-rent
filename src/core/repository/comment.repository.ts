import { Repository } from 'typeorm';
import { Comments } from '..';

export type CommentRepository = Repository<Comments>;
