import {
  AdminApiRoutes,
  DomainErrorCode,
  HttpStatusCode,
  type ApiErrorResponse,
  type CurrentUserDto,
  type LoginRequest,
} from '@kadr/shared';
import { http } from '@kadr/shared/http';

const LOGIN_ERROR_MESSAGES: Partial<Record<number, string>> = {
  [DomainErrorCode.INVALID_CREDENTIALS]: 'Невірний email або пароль',
  [HttpStatusCode.TOO_MANY_REQUESTS]:
    'Забагато спроб. Спробуйте ще раз за хвилину',
};

const GENERIC_ERROR_MESSAGE = 'Щось пішло не так. Спробуйте ще раз';

function loginErrorMessage(response: ApiErrorResponse): string {
  return LOGIN_ERROR_MESSAGES[response.code] ?? GENERIC_ERROR_MESSAGE;
}

export const authService = {
  login: async (request: LoginRequest): Promise<CurrentUserDto> => {
    const response = await http.post<CurrentUserDto>(
      AdminApiRoutes.auth.login,
      request,
    );
    if (!response.success) throw new Error(loginErrorMessage(response));
    return response.data;
  },

  fetchCurrentUser: async (): Promise<CurrentUserDto | null> => {
    const response = await http.get<CurrentUserDto | null>(
      AdminApiRoutes.auth.me,
    );
    if (response.success) return response.data;
    if (response.code === HttpStatusCode.UNAUTHORIZED) return null;
    throw new Error(GENERIC_ERROR_MESSAGE);
  },

  logout: async (): Promise<void> => {
    const response = await http.post<null>(AdminApiRoutes.auth.logout);
    const isLoggedOut =
      response.success || response.code === HttpStatusCode.UNAUTHORIZED;
    if (!isLoggedOut) throw new Error(GENERIC_ERROR_MESSAGE);
  },
};
