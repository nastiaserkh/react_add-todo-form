import { useState } from 'react';
import { Nullable } from '../..//components/domain/Nullable';
import usersFromServer from '../../api/users';
import { Todo } from '../domain/Todo';

type AddTodoFormProps = {
  onSubmit: (todo: Omit<Todo, 'id'>) => void;
};

export const AddTodoForm = ({ onSubmit }: AddTodoFormProps) => {
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState<Nullable<string>>(null);

  const [userId, setUserId] = useState(0);
  const [userIdError, setUserIdError] = useState<Nullable<string>>(null);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;

    setTitle(newTitle);

    if (titleError && newTitle.trim().length > 0) {
      setTitleError(null);
    }
  };

  const handleUserIdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newUserId = +event.target.value;

    setUserId(newUserId);

    if (userIdError && newUserId !== 0) {
      setUserIdError(null);
    }
  };

  const handleReset = () => {
    setTitle('');
    setUserId(0);
    setTitleError(null);
    setUserIdError(null);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const normalizeTitle = title.trim();

    const titleIsEmpty = !normalizeTitle;
    const userIsNotChosen = userId === 0;

    if (titleIsEmpty) {
      setTitleError('Please enter a title');
    }

    if (userIsNotChosen) {
      setUserIdError('Please choose a user');
    }

    if (titleIsEmpty || userIsNotChosen) {
      return;
    }

    onSubmit({
      title: normalizeTitle,
      completed: false,
      userId: userId,
    });
    handleReset();
  };

  return (
    <form action="/api/todos" method="POST" onSubmit={handleSubmit}>
      <div className="field">
        <input
          type="text"
          data-cy="titleInput"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter a title"
        />
        {titleError && <span className="error">{titleError}</span>}
      </div>

      <div className="field">
        <select
          data-cy="userSelect"
          value={userId}
          onChange={handleUserIdChange}
        >
          <option value="0" disabled>
            Choose a user
          </option>
          {usersFromServer.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        {userIdError && <span className="error">{userIdError}</span>}
      </div>

      <button type="submit" data-cy="submitButton">
        Add
      </button>
    </form>
  );
};
