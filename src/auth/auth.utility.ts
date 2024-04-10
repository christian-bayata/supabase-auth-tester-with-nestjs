import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthUtility {
  /**
   * @Responsibility: dedicated function for generating a 10 digit random access code
   *
   * @returns {string}
   */
  generateRandomPassword(length: number): string {
    const uuid = uuidv4().replace(/-/g, '');
    const shortenedUuid = uuid.slice(0, length);
    return shortenedUuid;
  }

  /**
   * @Responsibility: dedicated function for encoding access code for users
   *
   * @returns {string}
   */

  generateAccessCode(data: string): string {
    const jsonStr = JSON.stringify(data);
    return Buffer.from(jsonStr).toString('base64');
  }

  /**
   * @Responsibility: dedicated function for decoding user access code
   *
   * @returns {string}
   */

  decodeAccessCode(encodedKey: string): string {
    return Buffer.from(encodedKey, 'base64').toString('utf-8');
  }
}
