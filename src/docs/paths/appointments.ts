/**
 * @openapi
 * /appointments:
 *   post:
 *     tags: [Appointments]
 *     summary: Agendar consulta
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - date
 *               - time
 *             properties:
 *               patientId:
 *                 type: string
 *                 format: uuid
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-09-29"
 *               time:
 *                 type: string
 *                 example: "15:00"
 *     responses:
 *       201:
 *         description: Consulta agendada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Paciente não encontrado
 *       409:
 *         description: Horário indisponível
 *
 *   get:
 *     tags: [Appointments]
 *     summary: Listar consultas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de consultas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Não autorizado
 *
 * /appointments/{id}:
 *   put:
 *     tags: [Appointments]
 *     summary: Atualizar consulta
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
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *                 example: "15:30"
 *               status:
 *                 type: string
 *                 example: COMPLETED
 *     responses:
 *       200:
 *         description: Consulta atualizada
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Consulta não encontrada
 *       409:
 *         description: Horário indisponível
 *
 *   delete:
 *     tags: [Appointments]
 *     summary: Excluir consulta
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
 *         description: Consulta excluída
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Consulta não encontrada
 *
 * /appointments/{id}/notes:
 *   post:
 *     tags: [Appointments]
 *     summary: Adicionar observação à consulta
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
 *             required:
 *               - description
 *             properties:
 *               description:
 *                 type: string
 *                 example: Paciente relata melhora dos sintomas.
 *     responses:
 *       201:
 *         description: Observação registrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConsultationNote'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Consulta não encontrada
 */

export {}