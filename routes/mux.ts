import express from 'express';

const router = express.Router();

// Configuration Mux
const MUX_TOKEN_ID = process.env.MUX_TOKEN_ID;
const MUX_TOKEN_SECRET = process.env.MUX_TOKEN_SECRET;

const authHeader = `Basic ${Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString('base64')}`;

/**
 * 1. Route pour créer un live stream
 * POST /api/mux/create-stream
 */
router.post('/create-stream', async (req, res) => {
  try {
    const response = await fetch('https://api.mux.com/video/v1/live-streams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        playback_policy: ['public'],
        new_asset_settings: { playback_policy: ['public'] },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Erreur lors de la création du stream');
    }

    // Retourne la stream_key et le playback_id
    res.json({
      id: data.data.id,
      stream_key: data.data.stream_key,
      playback_id: data.data.playback_ids[0].id,
      status: data.data.status,
    });
  } catch (error: any) {
    console.error('Mux Create Stream Error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 2. Route pour supprimer un live stream
 * DELETE /api/mux/delete-stream/:id
 */
router.delete('/delete-stream/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`https://api.mux.com/video/v1/live-streams/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error?.message || 'Erreur lors de la suppression du stream');
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('Mux Delete Stream Error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 3. Route pour récupérer le statut d'un stream
 * GET /api/mux/get-status/:id
 */
router.get('/get-status/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`https://api.mux.com/video/v1/live-streams/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Erreur lors de la récupération du statut');
    }

    res.json({
      status: data.data.status, // "idle" / "active" / "disabled"
      playback_id: data.data.playback_ids[0].id,
    });
  } catch (error: any) {
    console.error('Mux Get Status Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
