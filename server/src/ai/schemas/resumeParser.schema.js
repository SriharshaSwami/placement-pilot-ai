export const resumeParserSchemaJSON = {
  "type": "object",
  "properties": {
    "candidate": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "email": {
          "type": "string"
        },
        "phone": {
          "type": "string"
        },
        "linkedin": {
          "type": "string"
        },
        "github": {
          "type": "string"
        },
        "portfolio": {
          "type": "string"
        },
        "location": {
          "type": "string"
        }
      }
    },
    "professionalSummary": {
      "type": "string"
    },
    "skills": {
      "type": "object",
      "properties": {
        "languages": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "frameworks": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "libraries": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "databases": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "cloud": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "devOps": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "tools": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "aiML": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "other": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },
    "education": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "institution": {
            "type": "string"
          },
          "degree": {
            "type": "string"
          },
          "specialization": {
            "type": "string"
          },
          "startDate": {
            "type": "string"
          },
          "endDate": {
            "type": "string"
          },
          "cgpa": {
            "type": "string"
          },
          "percentage": {
            "type": "string"
          },
          "location": {
            "type": "string"
          }
        }
      }
    },
    "experience": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "company": {
            "type": "string"
          },
          "role": {
            "type": "string"
          },
          "employmentType": {
            "type": "string"
          },
          "startDate": {
            "type": "string"
          },
          "endDate": {
            "type": "string"
          },
          "duration": {
            "type": "string"
          },
          "location": {
            "type": "string"
          },
          "responsibilities": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "technologies": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      }
    },
    "projects": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "technologies": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "github": {
            "type": "string"
          },
          "liveDemo": {
            "type": "string"
          },
          "achievements": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      }
    },
    "certifications": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "issuer": {
            "type": "string"
          },
          "date": {
            "type": "string"
          },
          "url": {
            "type": "string"
          }
        }
      }
    },
    "achievements": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string"
          },
          "description": {
            "type": "string"
          }
        }
      }
    },
    "leadership": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "role": {
            "type": "string"
          },
          "organization": {
            "type": "string"
          },
          "description": {
            "type": "string"
          }
        }
      }
    },
    "publications": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string"
          },
          "publisher": {
            "type": "string"
          },
          "date": {
            "type": "string"
          },
          "url": {
            "type": "string"
          }
        }
      }
    },
    "openSource": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "project": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "url": {
            "type": "string"
          }
        }
      }
    },
    "hackathons": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "role": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "date": {
            "type": "string"
          }
        }
      }
    },
    "codingProfiles": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "platform": {
            "type": "string"
          },
          "username": {
            "type": "string"
          },
          "url": {
            "type": "string"
          }
        }
      }
    },
    "languagesSpoken": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "language": {
            "type": "string"
          },
          "proficiency": {
            "type": "string"
          }
        }
      }
    }
  }
};
