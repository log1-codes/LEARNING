#include <iostream>
using namespace std;

int main()
{
    int n1, n2;
    cin >> n1 >> n2;

    int i = n1;   // initialize i

    while (i <= n2) {
        cout << i << " ";
        i++;
    }

    return 0;
}
