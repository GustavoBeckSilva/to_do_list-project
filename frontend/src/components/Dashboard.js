
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, InputGroup, Spinner, Alert } from 'react-bootstrap';
import {
  getAllTarefas,
  createTarefa,
  deleteTarefa,
  markTarefaAsConcluida,
  markTarefaAsPendente
} from '../services/api';

function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoPrazo, setNewTodoPrazo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllTarefas();
      setTodos(response.data);
    } catch (err) {
      console.error("Erro ao buscar tarefas:", err);
      setError('Falha ao carregar tarefas. Verifique se o backend está rodando e acessível.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []); 

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodoText.trim()) {
      alert('A descrição da tarefa não pode estar vazia.');
      return;
    }

    const novaTarefaData = {
      descricao: newTodoText.trim(),
    };
    if (newTodoPrazo) {
      novaTarefaData.prazo = newTodoPrazo;
    }

    try {
      const response = await createTarefa(novaTarefaData);
      setTodos([...todos, response.data]);
      setNewTodoText('');
      setNewTodoPrazo('');
    } catch (err) {
      console.error("Erro ao adicionar tarefa:", err);
      setError(err.response?.data?.error || 'Falha ao adicionar tarefa.');
    }
  };

  const handleToggleComplete = async (id, isCompleted) => {
    try {
      let response;
      if (isCompleted) { 
        response = await markTarefaAsPendente(id);
      } else { 
        response = await markTarefaAsConcluida(id);
      }
      setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
    } catch (err) {
      console.error("Erro ao atualizar status da tarefa:", err);
      setError(err.response?.data?.error || 'Falha ao atualizar status da tarefa.');
    }
  };

  const handleDeleteTodo = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    try {
      await deleteTarefa(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      console.error("Erro ao deletar tarefa:", err);
      setError(err.response?.data?.error || 'Falha ao deletar tarefa.');
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
        <p>Carregando tarefas...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <Row className="justify-content-md-center">
        <Col md={10} lg={8}> {}
          <Card>
            <Card.Header as="h2" className="text-center">
              Meu Painel de Tarefas
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
              <Form onSubmit={handleAddTodo}>
                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="novaTarefaDescricao">Nova Tarefa</Form.Label>
                      <Form.Control
                        id="novaTarefaDescricao"
                        type="text"
                        placeholder="Descrição da tarefa..."
                        value={newTodoText}
                        onChange={(e) => setNewTodoText(e.target.value)}
                        aria-label="Nova tarefa descrição"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="novaTarefaPrazo">Prazo (Opcional)</Form.Label>
                      <Form.Control
                        id="novaTarefaPrazo"
                        type="date"
                        value={newTodoPrazo}
                        onChange={(e) => setNewTodoPrazo(e.target.value)}
                        aria-label="Prazo da nova tarefa"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary" type="submit" className="w-100">
                  Adicionar Tarefa
                </Button>
              </Form>

              <hr />

              <h3 className="mt-4 mb-3">Lista de Tarefas</h3>
              {todos.length === 0 && !loading && (
                <ListGroup>
                  <ListGroup.Item className="text-center text-muted">
                    Nenhuma tarefa por enquanto!
                  </ListGroup.Item>
                </ListGroup>
              )}
              <ListGroup>
                {todos.map(todo => (
                  <ListGroup.Item
                    key={todo.id}
                    as="li"
                    className={`d-flex justify-content-between align-items-center ${todo.concluida ? 'list-group-item-light text-muted' : ''}`}
                    style={{ textDecoration: todo.concluida ? 'line-through' : 'none' }}
                  >
                    <Form.Check
                      type="checkbox"
                      id={`todo-${todo.id}`}
                      label={
                        <span>
                          {todo.descricao}
                          {todo.prazo && (
                            <small className="d-block text-muted">
                              Prazo: {new Date(todo.prazo).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                              {}
                            </small>
                          )}
                        </span>
                      }
                      checked={todo.concluida}
                      onChange={() => handleToggleComplete(todo.id, todo.concluida)}
                      className="flex-grow-1 me-2"
                    />
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteTodo(todo.id)}
                    >
                      Excluir
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
            {todos.length > 0 && (
              <Card.Footer className="text-muted text-center">
                {todos.filter(todo => !todo.concluida).length} tarefas pendentes de {todos.length} no total.
              </Card.Footer>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;