import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { USER_ID_PREFIX } from '../users/entities/user.entity';

@ValidatorConstraint({ name: 'UserIdPrefixValidator', async: false })
export class UserIdPrefixValidator implements ValidatorConstraintInterface {
  validate(id: string, _validationArguments?: ValidationArguments): boolean {
    return typeof id === 'string' && id.startsWith(USER_ID_PREFIX);
  }

  defaultMessage(_validationArguments?: ValidationArguments): string {
    return 'Invalid User ID';
  }
}
