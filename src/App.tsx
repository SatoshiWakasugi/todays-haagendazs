import './App.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useState } from 'react';

type Answer = {
  flavor: {
    url: string;
    image: string;
    name: string;
    limited: string;
  };
  message: string;
};

function App() {
  const [feeling, setFeeling] = useState('');
  const [recommendation, setRecommendation] = useState<Answer | null>(null);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;

  const fetchRecommendation = async (text: string) => {
    try {
      const response = await fetch(`${API_URL}/flavor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({ feeling: text }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendation');
      }

      const data = await response.json();

      setRecommendation(data);
      setError(null);
    } catch (e) {
      console.error(e);
      setError('予期しないエラーが発生しました。');
    }
  };

  const handleSubmit = () => {
    if (!feeling) {
      setError('気持ちを入力してください。');
      return;
    }

    fetchRecommendation(feeling);
  };

  return (
    <>
      <Stack spacing={2}>
        <Typography variant="h2">Today's Häagen-Dazs ?</Typography>
        <Typography>
          今の気分に合わせたハーゲンダッツアイスクリームをおすすめしてくれるアプリです。
        </Typography>
        <TextField
          id="feeling"
          label="今の気持ちを入力してください"
          multiline
          rows={4}
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          error={!!error}
          helperText={error}
        />
        <Button type="button" variant="contained" onClick={handleSubmit}>
          送信
        </Button>
        {recommendation && (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <img
              src={recommendation?.flavor?.image}
              alt="product-image"
              style={{ width: '360px', borderRadius: '8px' }}
            />
            <Stack
              spacing={1}
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography variant="h4">
                {recommendation?.flavor?.name}
              </Typography>
              {recommendation?.flavor.limited && (
                <Chip label="期間限定" color="success" variant="outlined" />
              )}
              <Typography>{recommendation?.message}</Typography>
              <a href={recommendation?.flavor?.url} target="_blank">
                商品ページへ
              </a>
            </Stack>
          </Stack>
        )}
      </Stack>
    </>
  );
}

export default App;
