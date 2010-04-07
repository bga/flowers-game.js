var difMap=
{
  'easy':
  {
    'ship':
    {
      maxAModeTime: 10*33,
      maxSawTime: 10*33,
      maxSawFlowersCount: 20
    },
    'bonuses':
    {
      bonusChanse: 1/100
    },
    'flowers-pulse':
    {
      minCreateInterval: 2*33,
      dMinCreateInterval: -1/60,
      mMinCreateInterval: 0.5*33,

      maxCreateInterval: 33*4,
      dMaxCreateInterval: -1/30,
      mMaxCreateInterval: 33
    },
    'flowers-fall':
    {
      minCreateInterval: 2*33,
      dMinCreateInterval: -1/60,
      mMinCreateInterval: 0.5*33,

      maxCreateInterval: 33*4,
      dMaxCreateInterval: -1/30,
      mMaxCreateInterval: 33
    },
    'flowers-swing':
    {
      minCreateInterval: 2*33,
      dMinCreateInterval: -0.1,
      mMinCreateInterval: 10,

      maxCreateInterval: 33*4,
      dMaxCreateInterval: -0.1,
      mMaxCreateInterval: 33*2
    },
    'flowers-meteorite':
    {
      minCreateInterval: 2*33,
      dMinCreateInterval: -0.1,
      mMinCreateInterval: 10,

      maxCreateInterval: 33*4,
      dMaxCreateInterval: -0.1,
      mMaxCreateInterval: 33*2
    },
    'flowers-queue':
    {
      minQueueLen: 3,
      dMinQueueLen: 0.1,
      mMinQueueLen: 6,
      
      maxQueueLen: 10,
      dMaxQueueLen: 0.1,
      mMaxQueueLen: 20,

      minCreateInterval: 2*33,
      dMinCreateInterval: -0.1,
      mMinCreateInterval: 10,

      maxCreateInterval: 33*4,
      dMaxCreateInterval: -0.1,
      mMaxCreateInterval: 33*2
    }
  },
  'normal':
  {
    'ship':
    {
      maxAModeTime: 10*33,
      maxSawTime: 10*33,
      maxSawFlowersCount: 20
    },
    'bonuses':
    {
      bonusChanse: 0.001
    },
    'flowers-pulse':
    {
      minCreateInterval: 10,
      dMinCreateInterval: 0,
      mMinCreateInterval: 10,

      maxCreateInterval: 50,
      dMaxCreateInterval: 0,
      mMaxCreateInterval: 50
    },
    'flowers-fall':
    {
      minCreateInterval: 10,
      dMinCreateInterval: 0,
      mMinCreateInterval: 10,

      maxCreateInterval: 50,
      dMaxCreateInterval: 0,
      mMaxCreateInterval: 50
    },
    'flowers-swing':
    {
      minCreateInterval: 100,
      dMinCreateInterval: 0,
      mMinCreateInterval: 100,

      maxCreateInterval: 500,
      dMaxCreateInterval: 0,
      mMaxCreateInterval: 500
    },
    'flowers-meteorite':
    {
      minCreateInterval: 100,
      dMinCreateInterval: 0,
      mMinCreateInterval: 100,

      maxCreateInterval: 500,
      dMaxCreateInterval: 0,
      mMaxCreateInterval: 500
    },
    'flowers-queue':
    {
      minQueueLen: 3,
      dMinQueueLen: 0,
      mMinQueueLen: 3,
      
      maxQueueLen: 10,
      dMaxQueueLen: 0,
      mMaxQueueLen: 10,

      minCreateInterval: 10,
      dMinCreateInterval: 0,
      mMinCreateInterval: 10,
      
      maxCreateInterval: 50,
      dMaxCreateInterval: 0,
      mMaxCreateInterval: 50
    }
  },
  'hard':
  {
    'ship':
    {
      maxAModeTime: 10*33,
      maxSawTime: 10*33,
      maxSawFlowersCount: 20
    },
    'bonuses':
    {
      bonusChanse: 0.001
    },
    'flowers-pulse':
    {
      minCreateInterval: 10,
      dMinCreateInterval: 0,
      mMinCreateInterval: 10,

      maxCreateInterval: 50,
      dMaxCreateInterval: 0,
      mMaxCreateInterval: 50
    },
    'flowers-fall':
    {
      minCreateInterval: 10,
      dMinCreateInterval: 0,
      mMinCreateInterval: 10,

      maxCreateInterval: 50,
      dMaxCreateInterval: 0,
      mMaxCreateInterval: 50
    },
    'flowers-swing':
    {
      minCreateInterval: 100,
      dMinCreateInterval: 0,
      mMinCreateInterval: 100,

      maxCreateInterval: 500,
      dMaxCreateInterval: 0,
      mMaxCreateInterval: 500
    },
    'flowers-meteorite':
    {
      minCreateInterval: 100,
      dMinCreateInterval: 0,
      mMinCreateInterval: 100,

      maxCreateInterval: 500,
      dMaxCreateInterval: 0,
      mMaxCreateInterval: 500
    },
    'flowers-queue':
    {
      minQueueLen: 3,
      dMinQueueLen: 0,
      mMinQueueLen: 3,
      
      maxQueueLen: 10,
      dMaxQueueLen: 0,
      mMaxQueueLen: 10,

      minCreateInterval: 10,
      dMinCreateInterval: 0,
      mMinCreateInterval: 10,
      
      maxCreateInterval: 50,
      dMaxCreateInterval: 0,
      mMaxCreateInterval: 50
    }
  },
  'insane':
  {
    'ship':
    {
      maxAModeTime: 10*33,
      maxSawTime: 10*33,
      maxSawFlowersCount: 20
    },
    'bonuses':
    {
      bonusChanse: 0.001
    },
    'flowers-pulse':
    {
      minCreateInterval: 15,
      dMinCreateInterval: 1/40,
      mMinCreateInterval: 5,
      
      maxCreateInterval: 60,
      dMaxCreateInterval: 1/20,
      mMaxCreateInterval: 30
    },
    'flowers-fall':
    {
      minCreateInterval: 15,
      dMinCreateInterval: 1/40,
      mMinCreateInterval: 5,
      
      maxCreateInterval: 60,
      dMaxCreateInterval: 1/20,
      mMaxCreateInterval: 30
    },
    'flowers-swing':
    {
      minCreateInterval: 15,
      dMinCreateInterval: 1/40,
      mMinCreateInterval: 5,
      
      maxCreateInterval: 60,
      dMaxCreateInterval: 1/20,
      mMaxCreateInterval: 30
    },
    'flowers-meteorite':
    {
      minCreateInterval: 15,
      dMinCreateInterval: 1/40,
      mMinCreateInterval: 5,
      
      maxCreateInterval: 60,
      dMaxCreateInterval: 1/20,
      mMaxCreateInterval: 30
    },
    'flowers-queue':
    {
      minQueueLen: 5,
      dMinQueueLen: 1/40,
      mMinQueueLen: 10,
      
      maxQueueLen: 15,
      dMaxQueueLen: 1/20,
      mMaxQueueLen: 25,

      minCreateInterval: 15,
      dMinCreateInterval: 1/40,
      mMinCreateInterval: 5,
      
      maxCreateInterval: 60,
      dMaxCreateInterval: 1/20,
      mMaxCreateInterval: 30
    }
  }
};