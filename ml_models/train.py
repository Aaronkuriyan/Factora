"""
Training script for ML models
"""

from fake_news_classifier import FakeNewsClassifier

def main():
    print("Starting model training...")
    classifier = FakeNewsClassifier()
    print("Models ready for training!")

if __name__ == "__main__":
    main()
