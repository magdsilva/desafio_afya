/**
 * @openapi
 * /patients:
 *   post:
 *     tags: [Patients]
 *     summary: Cadastrar paciente
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - email
 *               - birthDate
 *               - gender
 *               - heightCm
 *               - weightGrams
 *             properties:
 *               name:
 *                 type: string
 *                 example: João da Silva
 *               phone:
 *                 type: string
 *                 example: "(84) 99999-9999"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@email.com
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "1990-05-20"
 *               gender:
 *                 type: string
 *                 example: MALE
 *               heightCm:
 *                 type: integer
 *                 example: 175
 *               weightGrams:
 *                 type: integer
 *                 example: 75000
 *     responses:
 *       201:
 *         description: Paciente criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno
 *
 *   get:
 *     tags: [Patients]
 *     summary: Listar pacientes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pacientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Patient'
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno
 *
 * /patients/{id}:
 *   get:
 *     tags: [Patients]
 *     summary: Buscar paciente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Paciente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Paciente não encontrado
 *
 *   put:
 *     tags: [Patients]
 *     summary: Atualizar paciente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               birthDate:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *               heightCm:
 *                 type: integer
 *               weightGrams:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Paciente atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Paciente não encontrado
 *
 *   delete:
 *     tags: [Patients]
 *     summary: Anonimizar paciente
 *     description: Realiza exclusão lógica e anonimização dos dados pessoais.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Paciente anonimizado
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Paciente não encontrado
 *
 * /patients/{id}/appointments:
 *   get:
 *     tags: [Patients]
 *     summary: Consultar histórico de consultas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Histórico de consultas do paciente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Appointment'
 *                   - type: object
 *                     properties:
 *                       notes:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/ConsultationNote'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Paciente não encontrado
 */

export {}